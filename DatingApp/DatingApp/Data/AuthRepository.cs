using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.Model;
using Microsoft.AspNetCore.Identity;
using Common.Model;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;

        public AuthRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<User> Register(User user, string password)
        {
            PasswordDto a = createPasswordSaltAndPasswordHash(password);

            user.PasswordHash = a.PasswordHash;
            user.PasswordSalt = a.PasswordSalt;

            await _context.Users.AddAsync(user);
           await _context.SaveChangesAsync();

            return user;
        }

        private PasswordDto createPasswordSaltAndPasswordHash(string password)
        {
            var dto = new PasswordDto();
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                dto.PasswordSalt = hmac.Key;
                dto.PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }

            return dto;
        }

        public async Task<User> Login(string user, string password)
        {
            if (!await isUserExist(user))
                return null;

            var userInDb = await _context.Users.FirstOrDefaultAsync(u => u.Username == user);

            bool isIdentical = CheckLoginPassword(password, userInDb);

            return isIdentical ? userInDb : null;
        }

        private bool CheckLoginPassword(string password, User userInDb)
        {
            bool isIdentical = true;
            using (var hmac = new System.Security.Cryptography.HMACSHA512(userInDb.PasswordSalt))
            {
                var enteredPasswordHashed = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < enteredPasswordHashed.Length; i++)
                {
                    if (enteredPasswordHashed[i] != userInDb.PasswordHash[i])
                        isIdentical = false;
                }
            }

            return isIdentical;
        }

        public async Task<bool> isUserExist(string user)
        {
            return await _context.Users.AnyAsync(u => u.Username == user);

        }
    }
}
