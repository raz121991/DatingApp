using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.Model;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Data
{
    public class UserRepository : DatingRepository,IUserRepository
    {
        private readonly DataContext _context;

        public UserRepository(DataContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            var users = await _context.Users.Include(p => p.Photos).ToListAsync();

            return users;
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.Id == id);

            return user;
        }
    }
}
