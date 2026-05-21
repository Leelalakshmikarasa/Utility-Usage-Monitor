using backend.Models;
using System.Linq;

namespace backend.Repos
{
    public interface IDeviceRepository
    {
        IQueryable<UtilityDevice> GetAll();
        IQueryable<UtilityDevice> GetByUser(string userId);
        UtilityDevice GetById(int id);
        void Add(UtilityDevice device);
        void Update(UtilityDevice device);
        void Delete(UtilityDevice device);
    }
}