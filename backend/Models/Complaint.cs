using System.Text.Json.Serialization;

namespace backend.Models
{
    public class Complaint
    {
        public int Id { get; set; }

        public required string Title { get; set; }
        public required string Description { get; set; }

        public string Status { get; set; } = "Pending";

        // ✅ Foreign Key
        public string UserId { get; set; } = "";

        // ✅ Navigation (FIXED)
        [JsonIgnore]
        public User? User { get; set; }
    }
}
