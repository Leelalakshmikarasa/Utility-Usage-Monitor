using Microsoft.AspNetCore.Mvc;
using backend.Repos;
using backend.DTOs;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _users;
        private readonly AuthService _authService;

        public AuthController(IUserRepository users, AuthService authService)
        {
            _users = users;
            _authService = authService;
        }

        [HttpPost("register")]
        public IActionResult Register(RegisterDTO dto)
        {
            var existing = _users.GetByUserName(dto.Username);
            if (existing != null)
                return BadRequest("Username already exists");

            var user = new User
            {
                UserId = System.Guid.NewGuid().ToString(),
                Username = dto.Username,
                Password = dto.Password,
                Role = dto.Role,
                Address = dto.Address
            };

            _users.Add(user);
            return Ok(user);
        }

        [HttpPost("login")]
        public IActionResult Login(LoginDTO dto)
        {
            var user = _users.GetByUserName(dto.Username);
            if (user == null) return Unauthorized();

            var token = _authService.GenerateToken(user);
            return Ok(new { token });
        }
    }
}
