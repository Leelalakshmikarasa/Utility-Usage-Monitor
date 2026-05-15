using backend.Models;

namespace backend.Repos

{

    public interface IReportRepository    {

        MonthlyReport GetElectricityMonthlyReport(int year, int month);

    }

}