using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class RegisterDTO
    {
        [Required]
        [MinLength(3)]
        public string Username { get; set; } = "";

        [Required]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = "";

        [Required]
        [MinLength(6)]
        [DataType(DataType.Password)] 
        [RegularExpression(
            @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$",
            ErrorMessage = "Password must contain uppercase, lowercase, number and special character"
        )]
        public string Password { get; set; } = "";

        [Required]
        public string Role { get; set; } = "";

        [Required]
        [RegularExpression(
            @"^(?!.*(\d)\1{9})(?!0123456789|1234567890|2345678901|3456789012|4567890123|5678901234|6789012345|7890123456|8901234567|9012345678)[6-9]\d{9}$",
            ErrorMessage = "Invalid phone number"
        )]
        public string PhoneNumber { get; set; } = "";

        [Required]
        [MinLength(3)]
        public string Address { get; set; } = "";
    }
}