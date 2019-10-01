using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using Common.Helpers;
using DatingApp.Data;
using DatingApp.Dto;
using DatingApp.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepo;
        private readonly ITokenGenerator _tokenGenerator;

        public AuthController(IAuthRepository authRepo, ITokenGenerator tokenGenerator)
        {
            _authRepo = authRepo;
            _tokenGenerator = tokenGenerator;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register(RegisterUserDto userForRegister)
        {
            userForRegister.Username = userForRegister.Username.ToLower();
            if (await _authRepo.isUserExist(userForRegister.Username))
            {
                return BadRequest("user already exists");
            }

            User user = new User();
            user.Username = userForRegister.Username;

            var createdUser = await _authRepo.Register(user, userForRegister.Password);

            return Ok(createdUser);
        }


        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginUserDto user)
        {
            var loggedUser = await _authRepo.Login(user.Username, user.Password);

            if (loggedUser == null)
                return BadRequest();

            SecurityTokenDescriptor token = _tokenGenerator.GenerateToken(loggedUser.Id.ToString(), loggedUser.Username);

            var tokenHandler = new JwtSecurityTokenHandler();

            var res = tokenHandler.CreateToken(token);

            return Ok(new
            {
                token = tokenHandler.WriteToken(res)
            });

        }
    }
}