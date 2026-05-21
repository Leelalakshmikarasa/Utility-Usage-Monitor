using backend.Data;
using backend.Models;
using System.Linq;

namespace backend.Repos
{
    public class EFUserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public EFUserRepository(AppDbContext context)
        {
            _context = context;
        }

        public IQueryable<User> GetAll()
        {
            return _context.Users;
        }

        public User GetById(string id)
        {
            return _context.Users.FirstOrDefault(u => u.UserId == id);
        }

        public User GetByUserName(string username)
        {
            return _context.Users.FirstOrDefault(u => u.Username == username);
        }

        public void Add(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
        }

        public void Update(User user)
        {
            _context.Users.Update(user);
            _context.SaveChanges();
        }

        public void Delete(User user)
        {
            _context.Users.Remove(user);
            _context.SaveChanges();
        }
    }
}