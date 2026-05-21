using backend.Models;
using System.Linq;

namespace backend.Repos
{
    public interface IDeviceRepository
    {
        IQueryable<UtilityDevice> GetAll();
        UtilityDevice GetById(int id);
        void Add(UtilityDevice device);
        void Update(UtilityDevice device);
        void Delete(UtilityDevice device);
    }
}}