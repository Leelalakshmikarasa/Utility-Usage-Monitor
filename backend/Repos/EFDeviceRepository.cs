using backend.Data;
using backend.Models;
using System.Linq;

namespace backend.Repos
{
    public class EFDeviceRepository : IDeviceRepository
    {
        private readonly AppDbContext _context;

        public EFDeviceRepository(AppDbContext context)
        {
            _context = context;
        }

        public IQueryable<UtilityDevice> GetAll()
        {
            return _context.Devices;
        }

        public IQueryable<UtilityDevice> GetByUser(string userId)
        {
            return _context.Devices.Where(d => d.UserId == userId);
        }

        public UtilityDevice GetById(int id)
        {
            return _context.Devices.FirstOrDefault(d => d.Id == id);
        }

        public void Add(UtilityDevice device)
        {
            _context.Devices.Add(device);
            _context.SaveChanges();
        }

        public void Update(UtilityDevice device)
        {
            _context.Devices.Update(device);
            _context.SaveChanges();
        }

        public void Delete(UtilityDevice device)
        {
            _context.Devices.Remove(device);
            _context.SaveChanges();
        }
    }
}