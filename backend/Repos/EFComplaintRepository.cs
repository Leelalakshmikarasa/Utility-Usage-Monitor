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

        public List<Complaint> GetAll()
        {
            return _context.Complaints.ToList();
        }

        public List<Complaint> GetByUser(string userId)
        {
            return _context.Complaints
                .Where(c => c.UserId == userId)
                .ToList();
        }

        // ✅ NEW METHOD
        public List<Complaint> GetByUserAndDevice(string userId, int deviceId)
        {
            return _context.Complaints
                .Where(c => c.UserId == userId && c.DeviceId == deviceId)
                .ToList();
        }

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