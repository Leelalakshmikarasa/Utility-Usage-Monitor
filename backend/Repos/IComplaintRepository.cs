using System.Linq;
using backend.Models;

namespace backend.Repos
{
    public interface IComplaintRepository
    {
        IQueryable<Complaint> GetAll();
        IQueryable<Complaint> GetByUserAndDevice(string userId, int deviceId);
        Complaint GetById(int id);
        void Add(Complaint complaint);
        void Update(Complaint complaint);
        void Delete(Complaint complaint);
    }
}