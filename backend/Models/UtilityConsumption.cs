using System.Text.Json.Serialization;

namespace backend.Models
{
    public class UtilityConsumption
    {
        public int Id { get; set; }
        public double Units { get; set; }
        public double Cost { get; set; }

        // ✅ Keep DateTime for DB & reports
        public DateTime Date { get; set; }

        public string UserId { get; set; } = "";
        public int UtilityDeviceId { get; set; }

        [JsonIgnore]
        public User? User { get; set; }

        [JsonIgnore]
        public UtilityDevice? UtilityDevice { get; set; }
    }
}