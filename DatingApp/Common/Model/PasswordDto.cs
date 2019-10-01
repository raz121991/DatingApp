using System;
using System.Collections.Generic;
using System.Text;

namespace Common.Model
{
    public class PasswordDto
    {
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
    }
}
