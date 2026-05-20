using System.Text.Json.Serialization;

namespace backend.Models
{
    public class Complaint
    {
        public int Id { get; set; }

        public required string Title { get; set; }
        public required string Description { get; set; }

        // ✅ DEFAULT STATUS (DO NOT SEND FROM FRONTEND)
        public string Status { get; set; } = "Pending";

        // ✅ Foreign Keys
        public string UserId { get; set; } = "";
        public int? DeviceId { get; set; }

        public DateTime Date { get; set; }
  

        // ✅ Navigation
        [JsonIgnore]
        public User? User { get; set; }

        [JsonIgnore]
        public UtilityDevice? Device { get; set; }
    }
}