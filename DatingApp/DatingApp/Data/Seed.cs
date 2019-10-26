using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Common.Model;
using DatingApp.Model;
using Newtonsoft.Json;

namespace DatingApp.Data
{
    public class Seed
    {
        public static void SeedUsers(DataContext context)
        {
            if (context.Users.Any())
                return;

            var userData = System.IO.File.ReadAllText("Data/UserSeedData.json");
            var users = JsonConvert.DeserializeObject<List<User>>(userData);

            AddUsers(users,context);
        }

        private static void AddUsers(List<User> users, DataContext context)
        {
            foreach (var user in users)
            {
                var passwordSeed = createPasswordSaltAndPasswordHash("password");
                user.PasswordHash = passwordSeed.PasswordHash;
                user.PasswordSalt = passwordSeed.PasswordSalt;

                user.Username = user.Username.ToLower();
                context.Users.Add(user);

            }

            context.SaveChanges();
        }

        private static PasswordDto createPasswordSaltAndPasswordHash(string password)
        {
            var dto = new PasswordDto();
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                dto.PasswordSalt = hmac.Key;
                dto.PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }

            return dto;
        }
    }
}
