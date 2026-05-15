using System.Linq;
using backend.Data;using backend.Models;

namespace backend.Repos

{

    public class EFReportRepository : IReportRepository    {

        private readonly AppDbContext _context;


        // CONSTRUCTOR (NO return type!)
        public EFReportRepository(AppDbContext context)

        {
            _context = context;
        }


        //  METHOD WITH RETURN TYPE
        public MonthlyReport GetElectricityMonthlyReport(int year, int month)

        {

            var data = _context.Consumptions

                .Where(c => c.Date.Year == year && c.Date.Month == month)
                .ToList();
            if (!data.Any())
                return null;
            var totalUnits = data.Sum(x => x.Units);
            var peak = data.OrderByDescending(x => x.Units).First();
            return new MonthlyReport            {
                Year = year,
                Month = month,
                TotalUnits = totalUnits,
                AverageUnits = data.Average(x => x.Units),
                EstimatedCost = totalUnits * 5,
                PeakDay = peak.Date,
                PeakUnits = peak.Units
                 
    };

        }

    }

}