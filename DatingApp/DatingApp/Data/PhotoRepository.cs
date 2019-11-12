using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.Model;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Data
{
    public class PhotoRepository : DatingRepository,IPhotoRepository
    {
        private readonly DataContext _context;

        public PhotoRepository(DataContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);

            return photo;
        }

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            var photo = await _context.Photos.Where(p => p.User.Id == userId).FirstOrDefaultAsync(p => p.IsMain);
           
            return photo;
        }
    }
}
