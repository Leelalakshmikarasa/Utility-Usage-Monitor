using System.Text.Json.Serialization;

namespace backend.Models
{
    public class UtilityDevice
    {
        public int Id { get; set; }
        public string DeviceName { get; set; } = "";
        public string UserId { get; set; } = "";

        [JsonIgnore]
        public User? User { get; set; }

        [JsonIgnore]
        public ICollection<UtilityConsumption>? Consumptions { get; set; }
    }
}
