namespace backend.Models

{

    public class MonthlyReport    {


        public int Year { get; set; }

        public int Month { get; set; }


        public double TotalUnits { get; set; }

        public double AverageUnits { get; set; }

        public double EstimatedCost { get; set; }


        public DateTime PeakDay { get; set; }

        public double PeakUnits { get; set; }


    }

}