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

        // ✅ GET → User Profile
        [HttpGet("{id}")]
        public IActionResult GetUser(string id)
        {
            var user = _users.GetById(id);
            if (user == null)
                return NotFound();

            return Ok(user);
        }

        // ✅ PUT → Update User Profile
        [HttpPut("{id}")]
        public IActionResult UpdateUser(string id, [FromBody] User updatedUser)
        {
            var user = _users.GetById(id);
            if (user == null)
                return NotFound();

            // ✅ Email NOT editable
            user.Username = updatedUser.Username;
            user.PhoneNumber = updatedUser.PhoneNumber;
            user.Address = updatedUser.Address;

            _users.Update(user);
            return Ok(user);
        }

        // ✅ GET → Devices
        [HttpGet("{id}/devices")]
        public IActionResult GetDevices(string id)
        {
            return Ok(_devices.GetByUser(id));
        }

        // ✅ GET → Complaints
        [HttpGet("{id}/complaints")]
        public IActionResult GetComplaints(string id)
        {
            return Ok(_complaints.GetByUser(id));
        }

        // ✅ ✅ ✅ POST → Add Complaint (WITH DATE SUPPORT)
        [HttpPost("{id}/complaint")]
        public IActionResult AddComplaint(string id, [FromBody] Complaint complaint)
        {
            if (complaint.DeviceId == null)
                return BadRequest("DeviceId is required");

            var device = _devices.GetById(complaint.DeviceId.Value);
            if (device == null || device.UserId != id)
                return BadRequest("Invalid device");

            complaint.UserId = id;

            // ✅ ✅ ADD DATE SUPPORT (ONLY CHANGE)
            if (complaint.Date == default)
                complaint.Date = DateTime.Now;

            _complaints.Add(complaint);
            return Ok(complaint);
        }

        // ✅ GET → Consumption
        [HttpGet("{id}/consumption")]
        public IActionResult GetConsumption(string id)
        {
            return Ok(new
            {
                userId = id,
                consumptions = _consumptions.GetByUser(id)
            });
        }
    }
}