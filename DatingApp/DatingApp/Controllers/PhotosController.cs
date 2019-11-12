using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.Data;
using DatingApp.Dto;
using DatingApp.Helpers;
using DatingApp.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.Controllers
{
    [Route("api/users/{userId}/photos")]
    [ApiController]
    [Authorize]
    public class PhotosController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private readonly IUserRepository _userRepository;
        private readonly IPhotoRepository _photoRepository;

        private Cloudinary _cloudinary;

        public PhotosController(IMapper _mapper, IOptions<CloudinarySettings> cloudinaryConfig,
            IUserRepository _userRepository, IPhotoRepository _photoRepository)
        {
            this._mapper = _mapper;
            _cloudinaryConfig = cloudinaryConfig;
            this._userRepository = _userRepository;
            this._photoRepository = _photoRepository;
            Account account = new Account(
                _cloudinaryConfig.Value.CloudName,
                cloudinaryConfig.Value.ApiKey,
                cloudinaryConfig.Value.ApiSecret
            );
            _cloudinary = new Cloudinary(account);
        }



        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo = await _photoRepository.GetPhoto(id);
            var photoToReturn = _mapper.Map<PhotoDto>(photoFromRepo);

            return Ok(photoToReturn);
        }


        [HttpPost("{photoId}/setMain")]
        public async Task<IActionResult> SetMain(int userId, int photoId)
        {
            if (userId != Int32.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var userFromRepo = await _userRepository.GetUser(userId);
            if (userFromRepo.Photos.All(p => p.Id != photoId))
                return Unauthorized();

            var photo = await _photoRepository.GetPhoto(photoId);

            if (photo == null)
                return BadRequest("Photo does not exist for user");

            if (photo.IsMain)
                return Unauthorized("Photo is already set to main photo");

            var mainPreviousPhoto = await _photoRepository.GetMainPhotoForUser(userId);
            mainPreviousPhoto.IsMain = false;

            photo.IsMain = true;

            if (await _photoRepository.SaveAll())
                return NoContent();

            return BadRequest("Somthing happend while setting main photo");

        }

        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId, [FromForm]PhotoForCreationDto photoForCreation)
        {
            if (userId != Int32.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var userFromRepo = await _userRepository.GetUser(userId);

            var file = photoForCreation.File;

            var uploadResult = new ImageUploadResult();
            if (file != null && file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")

                    };
                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            photoForCreation.Url = uploadResult.Uri.ToString();
            photoForCreation.PublicId = uploadResult.PublicId;

            var photo = _mapper.Map<Photo>(photoForCreation);

            if (!userFromRepo.Photos.Any(p => p.IsMain))
            {
                photo.IsMain = true;
            }

            userFromRepo.Photos.Add(photo);
            if (await _userRepository.SaveAll())
            {
                var photoToReturn = _mapper.Map<PhotoDto>(photo);
                return CreatedAtRoute("GetPhoto", new {id = photo.Id}, photoToReturn);
            }

            return BadRequest("Could not add the photo");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int id, int userId)
        {
            if (userId != Int32.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var userFromRepo = await _userRepository.GetUser(userId);
            if (userFromRepo.Photos.All(p => p.Id != id))
                return Unauthorized();

            var photo = await _photoRepository.GetPhoto(id);
            if (photo.IsMain)
                return BadRequest("Cannot delete main photo");


            if (photo.PublicId != null)
            {
                DeletionParams delete = new DeletionParams(photo.PublicId);
                var response = _cloudinary.Destroy(delete);

                if (response.Result == "ok")
                {
                    _photoRepository.Delete(photo);
                }

            }
            else
            {
                _photoRepository.Delete(photo);
            }

            if (await _photoRepository.SaveAll())
            {
                return Ok();
            }

            return BadRequest("Could not delete resource");
        }
    }
}