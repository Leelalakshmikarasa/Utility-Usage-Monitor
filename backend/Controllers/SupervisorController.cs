using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Repos;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/supervisor")]
    [Authorize(Roles = "Supervisor")]
    public class SupervisorController : ControllerBase
    {
        private readonly IUserRepository _users;
        private readonly IConsumptionRepository _consumption;

        public SupervisorController(
            IUserRepository users,
            IConsumptionRepository consumption)
        {
            _users = users;
            _consumption = consumption;
        }

        //  Get ALL consumers
        [HttpGet("consumers")]
        public IActionResult GetConsumers()
        {
            return Ok(_users.GetByRole(RoleType.Consumer));
        }

        //  Get all technicians
        [HttpGet("technicians")]
        public IActionResult GetTechnicians()
        {
            return Ok(_users.GetByRole(RoleType.Technician));
        }


        //  Delete user
        [HttpDelete("user/{id}")]
public IActionResult DeleteUser(string id)
{
    var user = _users.GetById(id);

    if (user == null)
        return NotFound("User not found");

    _users.Delete(id);

    return Ok("Deleted Successfully");
}

        [HttpGet("consumptions/by-address")]
    public IActionResult GetTotalConsumptionByAddress()
    {
    var data = _consumption.GetTotalByAddress();
    return Ok(data);
    }
    }
}