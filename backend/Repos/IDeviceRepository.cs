using backend.Models;

namespace backend.Repos
{
    public interface IDeviceRepository
    {
        void Add(UtilityDevice device);

        List<UtilityDevice> GetAll();

        List<UtilityDevice> GetByUser(string userId);

        UtilityDevice? GetById(int id);
    }
}