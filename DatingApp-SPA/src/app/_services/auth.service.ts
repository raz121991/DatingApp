import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/User';
import {map} from 'rxjs/operators';
import { AlertifyService } from './alertify.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl='http://localhost:5000/api/auth/';
  decodedToken:any;
  jwtHelper = new JwtHelperService(); 

constructor(private http:HttpClient, private alertify:AlertifyService) { }

login(user:User)
{
  return this.http.post(this.baseUrl + 'login',user).pipe(map((response:any) =>{
    const user = response;
    if(user)
    {
      localStorage.setItem('token',user.token);
      this.decodedToken = this.jwtHelper.decodeToken(user.token);
     
    }
  }))
}

register(user:User)
{
  const url = this.baseUrl + "register";
  return this.http.post(url,user);
}


isLoggedIn()
{
  const token = localStorage.getItem('token');
  if(token)
  {
    return !this.jwtHelper.isTokenExpired(token);

  }
}

logout()
{
  localStorage.removeItem('token');
  this.alertify.message('logged out');
  
}

}
