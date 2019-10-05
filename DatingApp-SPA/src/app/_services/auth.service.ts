import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/User';
import {map} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl='http://localhost:5000/api/auth/';

constructor(private http:HttpClient) { }

login(user:User)
{
  return this.http.post(this.baseUrl + 'login',user).pipe(map((response:any) =>{
    const user = response;
    if(user)
    {
      localStorage.setItem('token',user.token);
    }
  }))
}

register(user:User)
{
  const url = this.baseUrl + "register";
  return this.http.post(url,user);
}


logout()
{
  localStorage.removeItem('token');
  console.log('logged out');
}

}
