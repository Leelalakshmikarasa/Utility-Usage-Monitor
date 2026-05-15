using backend.Models;

namespace backend.Repos
{
    public interface IComplaintRepository
    {
        List<Complaint> GetAll();
        List<Complaint> GetByUser(string userId);
        void Add(Complaint complaint);
        void Update(Complaint complaint);

        
    }
}