using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Models;
using backend.Data;
using backend.DTOs;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ConsumptionController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ConsumptionController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ POST → Add consumption with custom date
        [HttpPost]
        public IActionResult AddConsumption(ConsumptionDTO dto)
        {
            // ✅ Check user exists
            if (!_context.Users.Any(u => u.UserId == dto.UserId))
                return BadRequest("User does not exist");

            // ✅ Check device belongs to user
            var device = _context.Devices.FirstOrDefault(d =>
                d.Id == dto.UtilityDeviceId && d.UserId == dto.UserId);

            if (device == null)
                return BadRequest("Invalid device for this user");

            // ✅ Convert custom date → DateTime
            DateTime date;
            try
            {
                date = new DateTime(dto.Year, dto.Month, dto.Day);
            }
            catch
            {
                return BadRequest("Invalid date");
            }

            var consumption = new UtilityConsumption
            {
                Units = dto.Units,
                Cost = dto.Cost == 0 ? dto.Units * 10 : dto.Cost,
                Date = date,
                UserId = dto.UserId,
                UtilityDeviceId = dto.UtilityDeviceId
            };

            _context.Consumptions.Add(consumption);
            _context.SaveChanges();

            return Ok(consumption);
        }

        // ✅ GET → User consumptions (custom date output)
        [HttpGet("{userId}")]
        public IActionResult GetByUser(string userId)
        {
            var data = _context.Consumptions
                .Include(c => c.UtilityDevice)
                .Where(c => c.UserId == userId)
                .Select(c => new
                {
                    c.Id,
                    c.Units,
                    c.Cost,

                    // ✅ Custom date output format
                    Date = new
                    {
                        Day = c.Date.Day,
                        Month = c.Date.Month,
                        Year = c.Date.Year
                    },

                    DeviceName = c.UtilityDevice!.DeviceName
                })
                .ToList();

            return Ok(data);
        }
    }
}