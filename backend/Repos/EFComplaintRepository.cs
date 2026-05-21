using backend.Data;
using backend.Models;
using System.Linq;

namespace backend.Repos
{
    public class EFComplaintRepository : IComplaintRepository
    {
        private readonly AppDbContext _context;

        public EFComplaintRepository(AppDbContext context)
        {
            _context = context;
        }

        public IQueryable<Complaint> GetAll()
        {
            return _context.Complaints;
        }

        public IQueryable<Complaint> GetByUserAndDevice(string userId, int deviceId)
        {
            return _context.Complaints.Where(c => c.UserId == userId && c.DeviceId == deviceId);
        }

        public Complaint GetById(int id)
        {
            return _context.Complaints.FirstOrDefault(c => c.Id == id);
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

        public void Delete(Complaint complaint)
        {
            _context.Complaints.Remove(complaint);
            _context.SaveChanges();
        }
    }
}