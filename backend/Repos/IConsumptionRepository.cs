using System.Linq;
using backend.Models;

namespace backend.Repos
{
    public interface IConsumptionRepository
    {
        IQueryable<UtilityConsumption> GetAll();
        UtilityConsumption GetById(int id);
        void Add(UtilityConsumption consumption);
        void Update(UtilityConsumption consumption);
        void Delete(UtilityConsumption consumption);
    }
}