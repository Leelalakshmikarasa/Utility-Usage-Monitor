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

        // ✅ GET → Consumers (Filtered by Address)
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

            return Ok(consumers);
        }

        // ✅ GET → Complaints (Filtered by Address)
        [HttpGet("complaints")]
        public IActionResult GetComplaints()
        {
            var technician = GetCurrentTechnician();
            if (technician == null)
                return Unauthorized();

            var userIds = _context.Users
                .Where(u => u.Address.Trim().ToLower() ==
                            technician.Address.Trim().ToLower())
                .Select(u => u.UserId)
                .ToList();

            var complaints = _context.Complaints
                .Where(c => userIds.Contains(c.UserId))
                .ToList();

            return Ok(complaints);
        }

        // ✅ GET → Consumptions (Filtered by Address)
        [HttpGet("consumptions")]
        public IActionResult GetConsumptionsByAddress()
        {
            var technician = GetCurrentTechnician();
            if (technician == null)
                return Unauthorized();

            var userIds = _context.Users
                .Where(u => u.Address.Trim().ToLower() ==
                            technician.Address.Trim().ToLower())
                .Select(u => u.UserId)
                .ToList();

            var deviceIds = _context.Devices
                .Where(d => userIds.Contains(d.UserId))
                .Select(d => d.Id)
                .ToList();

            var consumptions = _context.Consumptions
                .Where(c => deviceIds.Contains(c.UtilityDeviceId))
                .ToList();

            return Ok(consumptions);
        }

        // ✅ PUT → Resolve Complaint (Restricted by Address)
        [HttpPut("resolve/{id}")]
        public IActionResult ResolveComplaint(string id)
        {
            var technician = GetCurrentTechnician();
            if (technician == null)
                return Unauthorized();

            var complaint = _context.Complaints.FirstOrDefault(c => c.UserId == id);
            if (complaint == null)
                return NotFound();

            var user = _context.Users.FirstOrDefault(u => u.UserId == complaint.UserId);

            if (user == null ||
                user.Address.Trim().ToLower() !=
                technician.Address.Trim().ToLower())
            {
                return Forbid("You can only resolve complaints in your assigned area");
            }

            complaint.Status = "Resolved";
            _context.SaveChanges();

            return Ok(complaint);
        }

        [HttpPost("device")]
public IActionResult AddDevice(UtilityDevice device)
{
    var technician = GetCurrentTechnician();
    if (technician == null)
        return Unauthorized();

    var user = _context.Users.FirstOrDefault(u => u.UserId == device.UserId);

    if (user == null)
        return BadRequest("Invalid UserId.");

    if (user.Role != RoleType.Consumer)
        return BadRequest("Devices can only be assigned to consumers.");

    if (user.Address.Trim().ToLower() != 
        technician.Address.Trim().ToLower())
    {
        return Forbid("You can assign devices only within your area.");
    }

    try
    {
        _devices.Add(device);
        return Ok(device);
    }
    catch (InvalidOperationException ex)
    {
        return BadRequest(ex.Message);
    }
}
        // ✅ GET → Devices (Filtered by Address)
        [HttpGet("device")]
        public IActionResult GetAllDevices()
        {
            var technician = GetCurrentTechnician();
            if (technician == null)
                return Unauthorized();

            var userIds = _context.Users
                .Where(u => u.Address.Trim().ToLower() ==
                            technician.Address.Trim().ToLower())
                .Select(u => u.UserId)
                .ToList();

            var devices = _context.Devices
                .Where(d => userIds.Contains(d.UserId))
                .ToList();

            return Ok(devices);
        }

        // ✅ REPORT → Highest Month per Device per User
        [HttpGet("report/user-device-month")]
        public IActionResult GetUserDeviceReport()
        {
            var technician = GetCurrentTechnician();
            if (technician == null)
                return Unauthorized();

            var userIds = _context.Users
                .Where(u => u.Address.Trim().ToLower() ==
                            technician.Address.Trim().ToLower()
                         && u.Role == RoleType.Consumer)
                .Select(u => u.UserId)
                .ToList();

            var devices = _context.Devices
                .Where(d => userIds.Contains(d.UserId))
                .ToList();

            var report = devices
                .GroupJoin(
                    _context.Consumptions,
                    d => d.Id,
                    c => c.UtilityDeviceId,
                    (device, consumptions) => new
                    {
                        device,
                        consumptions
                    })
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
                    Devices = g.Select(d => new
                    {
                        d.DeviceId,
                        d.DeviceName,
                        HighestConsumptionMonth = d.HighestMonth
                    })
                })
                .ToList();

            return Ok(new
            {
                Address = technician.Address,
                Users = finalResult
            });
        }
    }
}