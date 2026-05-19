using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repos
{
    public class EFDeviceRepository : IDeviceRepository
    {
        private readonly AppDbContext _context;

        public EFDeviceRepository(AppDbContext context)
        {
            _context = context;
        }

        public List<UtilityDevice> GetByUser(string userId)
        {
            return _context.Devices
                .Where(d => d.UserId == userId)
                .ToList();
        }

        public List<UtilityDevice> GetAll()
        {
            return _context.Devices.ToList();
        }

        // ✅ ADD THIS
        public UtilityDevice? GetById(int id)
        {
            return _context.Devices.FirstOrDefault(d => d.Id == id);
        }

        public void Add(UtilityDevice device)
        {
            try
            {
                _context.Devices.Add(device);
                _context.SaveChanges();
            }
            catch (DbUpdateException)
            {
                throw new InvalidOperationException(
                    "Device name already exists. Please choose a unique device name."
                );
            }
        }
    }
}