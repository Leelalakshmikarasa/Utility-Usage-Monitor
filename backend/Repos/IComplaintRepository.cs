using backend.Models;

namespace backend.Repos
{
    public interface IComplaintRepository
    {
        List<Complaint> GetAll();

        List<Complaint> GetByUser(string userId);

        // ✅ ADD THIS (IMPORTANT)
        List<Complaint> GetByUserAndDevice(string userId, int deviceId);

        void Add(Complaint complaint);

        void Update(Complaint complaint);
    }
}