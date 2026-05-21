using backend.Data;
using backend.Models;
using backend.DTOs;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace backend.Repos
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        private string Hash(string password)
        {
            using var sha = SHA256.Create();
            return Convert.ToBase64String(
                sha.ComputeHash(Encoding.UTF8.GetBytes(password))
            );
        }

        //  REGISTER
        public User Register(RegisterDTO dto)
        {
            if (_context.Users.Any(x => x.Email == dto.Email))
                throw new Exception("Email already exists");

            if (!Enum.TryParse<RoleType>(dto.Role, true, out var roleEnum))
                throw new Exception("Invalid role");

            //  GAP‑FILL CustomIdS
            var existingIds = _context.Users
                .Where(x => x.Role == roleEnum)
                .Select(x => x.UserId)
                .ToList();
            var numbers = existingIds
                .Select(id => int.TryParse(id.Substring(1), out var n) ? n : 0)
                .Where(n => n > 0)
                .OrderBy(n => n)
                .ToList();

            int next = 1;
            foreach (var n in numbers)
            {
                if (n == next) next++;
                else break;
            }

            string prefix = roleEnum switch
            {
                RoleType.Consumer => "C",
                RoleType.Technician => "T",
                RoleType.Supervisor => "S",
                _ => "U"
            };

            var user = new User
            {
                UserId = $"{prefix}{next:D3}",
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = Hash(dto.Password),
                Role = roleEnum,
                PhoneNumber = dto.PhoneNumber,
                Address = dto.Address
            };

            _context.Users.Add(user);
            _context.SaveChanges();
            return user;
        }

        // LOGIN → JWT
        public string Login(LoginDTO dto)
        {
            var hash = Hash(dto.Password);

            var user = _context.Users.FirstOrDefault(x =>
                x.Email == dto.Email && x.PasswordHash == hash);

            if (user == null)
                return null;

            return GenerateToken(user);
        }

        public string GenerateToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[] {
                new Claim(ClaimTypes.NameIdentifier, user.UserId),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var token = new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Issuer"],
                claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}