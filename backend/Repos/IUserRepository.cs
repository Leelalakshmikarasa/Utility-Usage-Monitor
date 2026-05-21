using backend.Models;
using System.Linq;

namespace backend.Repos
{
    public interface IUserRepository
    {
        IQueryable<User> GetAll();
        User GetById(string id);
        User GetByUserName(string username);
        void Add(User user);
        void Update(User user);
        void Delete(string id);
    }
}