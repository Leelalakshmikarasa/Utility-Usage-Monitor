using backend.Data;
using backend.Models;
using backend.DTOs;
using Microsoft.EntityFrameworkCore;

namespace backend.Repos
{
    public class EFConsumptionRepository : IConsumptionRepository
    {
        private readonly AppDbContext _context;

        public EFConsumptionRepository(AppDbContext context)
        {
            _context = context;
        }

        public List<UtilityConsumption> GetAll()
        {
            return _context.Consumptions.ToList();
        }

        public List<UtilityConsumption> GetByUser(string userId)
        {
            return _context.Consumptions
                .Where(c => c.UserId == userId)
                .ToList();
        }

        // ✅ ADD THIS METHOD (Missing one causing error)
        public List<UtilityConsumption> GetByAddress(string address)
        {
            return _context.Consumptions
                .Include(c => c.User)
                .Include(c => c.UtilityDevice)
                .Where(c => c.User.Address.ToLower() == address.ToLower())
                .ToList();
        }
 
        // ✅ Your existing method (Correct)
        public List<ConsumptionByAddressDTO> GetTotalByAddress()
        {
            return (from c in _context.Consumptions
                    join u in _context.Users on c.UserId equals u.UserId
                    group c by u.Address into g
                    select new ConsumptionByAddressDTO
                    {
                        Address = g.Key,
                        TotalUsage = g.Sum(x => x.Units)
                    }).ToList();
        }

    }
}