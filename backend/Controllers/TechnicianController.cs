using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Repos;
using backend.Models;
using backend.Data;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/technician")]
    [Authorize(Roles = "Technician")]
    public class TechnicianController : ControllerBase
    {
        private readonly IUserRepository _users;
        private readonly IComplaintRepository _complaints;
        private readonly IDeviceRepository _devices;
        private readonly AppDbContext _context;
        private readonly IConsumptionRepository _consumption;

        public TechnicianController(
            IUserRepository users,
            IComplaintRepository complaints,
            IDeviceRepository devices,
            IConsumptionRepository consumption,
            AppDbContext context)
        {
            _users = users;
            _complaints = complaints;
            _devices = devices;
            _consumption = consumption;
            _context = context;
        }

        // ✅ Helper → Get logged-in technician
        private User? GetCurrentTechnician()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return _context.Users.FirstOrDefault(u => u.UserId == userId);
        }

        // ✅ CONSUMERS (WITH USERNAME ✅)
        [HttpGet("consumers")]
        public IActionResult GetConsumers()
        {
            var technician = GetCurrentTechnician();
            if (technician == null)
                return Unauthorized();

            var consumers = _context.Users
                .Where(u => u.Role == RoleType.Consumer &&
                            u.Address.Trim().ToLower() ==
                            technician.Address.Trim().ToLower())
                .ToList();

            var result = consumers.Select(c => new
            {
                userId = c.UserId,
                username = c.Username,          // ✅ FIXED
                address = c.Address,

                totalDevices = _context.Devices
                    .Count(d => d.UserId == c.UserId),

                devices = _context.Devices
                    .Where(d => d.UserId == c.UserId)
                    .GroupJoin(
                        _context.Consumptions,
                        d => d.Id,
                        cs => cs.UtilityDeviceId,
                        (d, csGroup) => new
                        {
                            deviceId = d.Id,
                            deviceName = d.DeviceName,
                            consumptions = csGroup
                                .Select(cs => new
                                {
                                    month = cs.Date.Month,
                                    year = cs.Date.Year,
                                    units = cs.Units,
                                    cost = cs.Cost
                                })
                                .ToList()
                        })
                    .ToList()
            }).ToList();

            return Ok(result);
        }

        // ✅ COMPLAINTS (WITH USERNAME)
        [HttpGet("complaints")]
        public IActionResult GetComplaints()
        {
            var technician = GetCurrentTechnician();
            if (technician == null)
                return Unauthorized();

            var complaints = (
                from c in _context.Complaints
                join u in _context.Users on c.UserId equals u.UserId
                join d in _context.Devices on c.DeviceId equals d.Id
                where u.Address.Trim().ToLower() ==
                      technician.Address.Trim().ToLower()
                select new
                {
                    userId = u.UserId,
                    username = u.Username,
                    address = u.Address,
                    deviceId = d.Id,
                    deviceName = d.DeviceName,
                    complaint = c.Title,
                    status = c.Status,

                    date = c.Date   // ✅ ✅ ADD THIS
                }
            ).ToList();

            return Ok(complaints);
        }

        // ✅ RESOLVE COMPLAINT
        [HttpPut("resolve/{userId}/{deviceId}")]
        public IActionResult Resolve(string userId, int deviceId)
        {
            var complaint = _complaints
                .GetByUserAndDevice(userId, deviceId)
                .FirstOrDefault(c => c.Status == "Pending");

            if (complaint == null)
                return NotFound("No pending complaint found");

            complaint.Status = "Resolved";
            _complaints.Update(complaint);

            return Ok("Complaint resolved");
        }

        // ✅ ADD DEVICE
        [HttpPost("device")]
        public IActionResult AddDevice(UtilityDevice device)
        {
            var technician = GetCurrentTechnician();
            if (technician == null)
                return Unauthorized();

            var user = _context.Users.FirstOrDefault(u => u.UserId == device.UserId);
            if (user == null || user.Role != RoleType.Consumer)
                return BadRequest("Invalid consumer");

            if (user.Address.Trim().ToLower() != technician.Address.Trim().ToLower())
                return Forbid();

            _devices.Add(device);
            return Ok(device);
        }

        // ✅ REPORT (WITH USERNAME)
        [HttpGet("report/user-device-month")]
        public IActionResult GetUserDeviceReport()
        {
            var technician = GetCurrentTechnician();
            if (technician == null)
                return Unauthorized();

            var users = _context.Users
                .Where(u => u.Role == RoleType.Consumer &&
                            u.Address.Trim().ToLower() ==
                            technician.Address.Trim().ToLower())
                .Select(u => new { u.UserId, u.Username })
                .ToList();

            var userIds = users.Select(u => u.UserId).ToList();

            var devices = _context.Devices
                .Where(d => userIds.Contains(d.UserId))
                .ToList();

            var report = devices
                .GroupJoin(
                    _context.Consumptions,
                    d => d.Id,
                    c => c.UtilityDeviceId,
                    (device, consumptions) => new { device, consumptions }
                )
                .Where(x => x.consumptions.Any())
                .Select(x => new
                {
                    UserId = x.device.UserId,
                    DeviceId = x.device.Id,
                    DeviceName = x.device.DeviceName,

                    HighestMonth = x.consumptions
                        .GroupBy(c => new { c.Date.Year, c.Date.Month })
                        .Select(g => new
                        {
                            Year = g.Key.Year,
                            Month = System.Globalization.CultureInfo
                                    .CurrentCulture.DateTimeFormat
                                    .GetMonthName(g.Key.Month),
                            TotalUnits = g.Sum(c => c.Units)
                        })
                        .OrderByDescending(g => g.TotalUnits)
                        .FirstOrDefault()
                })
                .ToList();

            var finalResult = report
                .GroupBy(r => r.UserId)
                .Select(g => new
                {
                    UserId = g.Key,
                    Username = users.First(u => u.UserId == g.Key).Username,
                    Devices = g.Select(d => new
                    {
                        d.DeviceId,
                        d.DeviceName,
                        HighestConsumptionMonth = d.HighestMonth
                    })
                })
                .ToList();

            return Ok(new { Users = finalResult });
        }
    }
}