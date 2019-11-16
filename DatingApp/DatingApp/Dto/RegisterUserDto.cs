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

        [Required(ErrorMessage = "Gender cannot be empty")]
        public string Gender { get; set; }

        [Required(ErrorMessage = "KnownAs cannot be empty")]
        public string KnownAs { get; set; }

        [Required(ErrorMessage = "Date of birth cannot be empty")]
        public DateTime DateOfBirth { get; set; }

        [Required(ErrorMessage = "City cannot be empty")]
        public string City { get; set; }

        [Required(ErrorMessage = "Username cannot be empty")]
        public string Country { get; set; }

        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }

        public RegisterUserDto()
        {
            Created = DateTime.Now;
            LastActive = DateTime.Now;
        }
    }
}
