using backend.Data;
using backend.Models;
using System.Linq;

namespace backend.Repos
{
    public class EFConsumptionRepository : IConsumptionRepository
    {
        private readonly AppDbContext _context;

        public EFConsumptionRepository(AppDbContext context)
        {
            _context = context;
        }

        public IQueryable<UtilityConsumption> GetAll()
        {
            return _context.Consumptions;
        }

        public IQueryable<UtilityConsumption> GetByUser(string userId)
        {
            return _context.Consumptions.Where(c => c.UserId == userId);
        }

        public IEnumerable<ConsumptionByAddressDTO> GetTotalByAddress()
        {
            // Join consumptions with users to group by user address
            var query = from c in _context.Consumptions
                        join u in _context.Users on c.UserId equals u.UserId
                        group c by u.Address into g
                        select new ConsumptionByAddressDTO
                        {
                            Address = g.Key,
                            TotalUsage = g.Sum(x => x.Units)
                        };

            return query.ToList();
        }

        public UtilityConsumption GetById(int id)
        {
            return _context.Consumptions.FirstOrDefault(c => c.Id == id);
        }

        public void Add(UtilityConsumption consumption)
        {
            _context.Consumptions.Add(consumption);
            _context.SaveChanges();
        }

        public void Update(UtilityConsumption consumption)
        {
            _context.Consumptions.Update(consumption);
            _context.SaveChanges();
        }

        public void Delete(UtilityConsumption consumption)
        {
            _context.Consumptions.Remove(consumption);
            _context.SaveChanges();
        }
    }
}