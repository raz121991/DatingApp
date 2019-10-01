using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.Dto
{
    public class RegisterUserDto
    {
        [Required(ErrorMessage = "Username cannot be empty")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Username cannot be empty")]
        [StringLength(12,MinimumLength = 6,ErrorMessage = "Password must be between 6 and 12 characters")]
        public string Password { get; set; }
    }
}
