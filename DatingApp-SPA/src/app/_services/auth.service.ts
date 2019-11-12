import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDto } from '../model/UserDto';
import {map} from 'rxjs/operators';
import { AlertifyService } from './alertify.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User } from '../model/User';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl=  environment.apiUrl +'auth/';
  decodedToken:any;
  jwtHelper = new JwtHelperService(); 
  currentUser:User;
  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();

constructor(private http:HttpClient, private alertify:AlertifyService) { }

changeMemberPhoto(photoUrl:string)
{
  this.photoUrl.next(photoUrl);
}

login(user:UserDto)
{
  return this.http.post(this.baseUrl + 'login',user).pipe(map((response:any) =>{
    const user = response;
    if(user)
    {
      localStorage.setItem('token',user.token);
      localStorage.setItem('user',JSON.stringify(user.user));
      this.decodedToken = this.jwtHelper.decodeToken(user.token);
     this.currentUser = user.user;
     this.changeMemberPhoto(this.currentUser.photoUrl);
    }
  }))
}

register(user:UserDto)
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
  localStorage.removeItem('user');
  this.decodedToken = null;
  this.currentUser = null;
  this.alertify.message('logged out');
  
}

}
