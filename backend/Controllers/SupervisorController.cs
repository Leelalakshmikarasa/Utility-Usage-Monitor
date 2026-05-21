using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Repos;
using backend.Models;
using backend.Data;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/supervisor")]
    [Authorize(Roles = "Supervisor")]
    public class SupervisorController : ControllerBase
    {
        private readonly IUserRepository _users;
        private readonly IConsumptionRepository _consumption;
        private readonly AppDbContext _context;

        public SupervisorController(
            IUserRepository users,
            IConsumptionRepository consumption,
            AppDbContext context)
        {
            _users = users;
            _consumption = consumption;
            _context = context;
        }

        

        // ✅ GET → Technicians (CLEAN OUTPUT)
        [HttpGet("technicians")]
        public IActionResult GetTechnicians()
        {
            var technicians = _context.Users
                .Where(t => t.Role == RoleType.Technician)
                .Select(t => new
                {
                    t.Id,
                    t.UserId,
                    t.Username,
                    t.Email,
                    t.PhoneNumber,
                    t.Address,
                    t.Role,

                    // ✅ Consumers under technician (same address)
                    ConsumersCount = _context.Users
                        .Count(u => u.Role == RoleType.Consumer &&
                                    u.Address.ToLower() == t.Address.ToLower()),

                    // ✅ Total complaints of those consumers
                    TotalComplaints = _context.Complaints
                        .Count(c => _context.Users
                            .Any(u => u.UserId == c.UserId &&
                                      u.Address.ToLower() == t.Address.ToLower())),

                    // ✅ Pending complaints
                    PendingComplaints = _context.Complaints
                        .Count(c => c.Status == "Pending" &&
                            _context.Users.Any(u => u.UserId == c.UserId &&
                                                     u.Address.ToLower() == t.Address.ToLower())),

                    // ✅ Resolved complaints
                    ResolvedComplaints = _context.Complaints
                        .Count(c => c.Status == "Resolved" &&
                            _context.Users.Any(u => u.UserId == c.UserId &&
                                                     u.Address.ToLower() == t.Address.ToLower()))
                })
                .ToList();

            return Ok(technicians);
        }

        // ✅ DELETE → User
        [HttpDelete("user/{id}")]
        public IActionResult DeleteUser(string id)
        {
            var user = _users.GetById(id);

            if (user == null)
                return NotFound("User not found");

            _users.Delete(id);
            return Ok("Deleted Successfully");
        }

        // ✅ REPORT → Total Consumption by Address (CLEAN OUTPUT)
        [HttpGet("consumptions/by-address")]
        public IActionResult GetTotalConsumptionByAddress()
        {
            var data = _consumption.GetTotalByAddress();
            return Ok(data);
        }
    }
}