using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.Model;

namespace DatingApp.Data
{
    public interface IPhotoRepository : IDatingRepository
    {
        Task<Photo> GetPhoto(int id);

        Task<Photo> GetMainPhotoForUser(int userId);
    }
}
