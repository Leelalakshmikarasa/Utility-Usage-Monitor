using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Repos;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/user")]
    [Authorize(Roles = "Consumer")]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _users;
        private readonly IComplaintRepository _complaints;
        private readonly IDeviceRepository _devices;
        private readonly IConsumptionRepository _consumptions;

        public UserController(
            IUserRepository users,
            IComplaintRepository complaints,
            IDeviceRepository devices,
            IConsumptionRepository consumptions)
        {
            _users = users;
            _complaints = complaints;
            _devices = devices;
            _consumptions = consumptions;
        }

        //  GET → User Info + Profile
        [HttpGet("{id}")]
        public IActionResult GetUser(string id)
        {
            return Ok(_users.GetById(id));
        }

        //  PUT → Update User Profile
        /*[HttpPut("{id}")]
        public IActionResult UpdateUser(int id, User updated)
        {
            var user = _users.GetById(id);

            if (user == null)
                return NotFound();

            user.Username = updated.Username;
            user.Email = updated.Email;

            _users.Update(user);

            return Ok(user);
        }*/

        //  GET → Assigned Devices
        [HttpGet("{id}/devices")]
        public IActionResult GetDevices(string id)
        {
            return Ok(_devices.GetByUser(id));
        }

        //  GET → Complaints
        [HttpGet("{id}/complaints")]
        public IActionResult GetComplaints(string id)
        {
            return Ok(_complaints.GetByUser(id));
        }

        //  POST → Raise Complaint
        [HttpPost("{id}/complaint")]
        public IActionResult AddComplaint(string id, Complaint c)
        {
            c.UserId = id;
            _complaints.Add(c);
            return Ok(c);
        }

        //  GET → Consumption + Cost
        [HttpGet("{id}/consumption")]
        public IActionResult GetConsumption(string id)
        {
            return Ok(_consumptions.GetByUser(id));
        }
    }
}