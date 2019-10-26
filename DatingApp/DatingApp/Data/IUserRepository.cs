using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.Model;

namespace DatingApp.Data
{
   public interface IUserRepository : IDatingRepository
    {
        Task<IEnumerable<User>> GetUsers();
        Task<User> GetUser(int id);
    }
}
