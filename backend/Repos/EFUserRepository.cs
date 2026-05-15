using backend.Data;
using backend.Models;

namespace backend.Repos
{
    public class EFUserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public EFUserRepository(AppDbContext context)
        {
            _context = context;
        }

        public List<User> GetAll() => _context.Users.ToList();

        public User? GetById(string id) =>
            _context.Users.FirstOrDefault(x => x.UserId == id);

        public List<User> GetByRole(RoleType role) =>
            _context.Users.Where(x => x.Role == role).ToList();

        public void Update(User user)
        {
            _context.Users.Update(user);
            _context.SaveChanges();
        }

        public void Delete(string id)
{
    var user = _context.Users.FirstOrDefault(u => u.UserId == id);

    if (user != null)
    {
        _context.Users.Remove(user);
        _context.SaveChanges();
    }
}

    }
}