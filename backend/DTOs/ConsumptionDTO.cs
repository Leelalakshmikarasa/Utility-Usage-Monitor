namespace backend.DTOs
{
    public class ConsumptionDTO
    {
        public double Units { get; set; }
        public double Cost { get; set; }

        // ✅ Custom date input
        public int Day { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }

        public string UserId { get; set; } = "";
        public int UtilityDeviceId { get; set; }

        
        
    }
}