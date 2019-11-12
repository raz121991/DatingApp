import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { User } from '../model/User';




@Injectable({
  providedIn: 'root'
})
export class UserService {
baseUrl= environment.apiUrl;

constructor(private http:HttpClient) { }

getUsers():Observable<User[]>{
  return this.http.get<User[]>(this.baseUrl + 'users');
}

getUser(id:number):Observable<User>{
  return this.http.get<User>(this.baseUrl +  'users/' + id);
}

updateUser(id:number,user:User){
  return this.http.put(this.baseUrl + 'users/' + id,user);
}

setMainPhoto(id:number,userId:number)
{
  return this.http.post(this.baseUrl + 'users/' + userId + "/photos/" + id + "/setMain",{})
}

deletePhoto(photoId:number,userId:number)
{
  return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + photoId);
}
}
