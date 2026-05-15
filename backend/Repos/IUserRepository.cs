using backend.Models;

namespace backend.Repos
{
    public interface IUserRepository
    {
        List<User> GetAll();
        User? GetById(string id);
        List<User> GetByRole(RoleType role);
        void Update(User user);
        void Delete(string id);
    }
}