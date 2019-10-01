using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Common.Helpers
{
    public interface ITokenGenerator
    {
        SecurityTokenDescriptor GenerateToken(string userId, string userName);
    }
}
