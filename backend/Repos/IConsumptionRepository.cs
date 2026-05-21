using System.Linq;
using backend.Models;

namespace backend.Repos
{
    public interface IConsumptionRepository
    {
        IQueryable<UtilityConsumption> GetAll();
        IQueryable<UtilityConsumption> GetByUser(string userId);
        IEnumerable<ConsumptionByAddressDTO> GetTotalByAddress();
        UtilityConsumption GetById(int id);
        void Add(UtilityConsumption consumption);
        void Update(UtilityConsumption consumption);
        void Delete(UtilityConsumption consumption);
    }
}