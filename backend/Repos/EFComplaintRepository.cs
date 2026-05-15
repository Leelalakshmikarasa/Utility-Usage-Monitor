using backend.Data;
using backend.Models;

namespace backend.Repos
{
    public class EFComplaintRepository : IComplaintRepository
    {
        private readonly AppDbContext _context;

        public EFComplaintRepository(AppDbContext context)
        {
            _context = context;
        }

        public List<Complaint> GetByUser(string userId)
        {
            return _context.Complaints
                .Where(c => c.UserId == userId)
                .ToList();
        }

        
public List<Complaint> GetAll() =>
            _context.Complaints.ToList();


        public void Add(Complaint complaint)
        {
            _context.Complaints.Add(complaint);
            _context.SaveChanges();
        }

        
public void Update(Complaint complaint)
        {
            _context.Complaints.Update(complaint);
            _context.SaveChanges();
        }

    }
}