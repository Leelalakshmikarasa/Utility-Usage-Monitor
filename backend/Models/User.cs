namespace backend.Models
{
    public class User
    {
        public int Id { get; set; }

        public string UserId { get; set; } = "";   // ✅ required string

        public string Username { get; set; } = "";
        public string Email { get; set; } = "";
        public string PasswordHash { get; set; } = "";

        public string PhoneNumber { get; set; } = "";
        public string Address { get; set; } = "";

        public RoleType Role { get; set; }

        public ICollection<Complaint> Complaints { get; set; } = new List<Complaint>();
        public ICollection<UtilityDevice> Devices { get; set; } = new List<UtilityDevice>();
        public ICollection<UtilityConsumption> Consumptions { get; set; } = new List<UtilityConsumption>();
    }
}