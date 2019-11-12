import { Component, OnInit } from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import { AuthService } from './_services/auth.service';
import { User } from './model/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  jwtHelper = new JwtHelperService(); 

  constructor(private authService:AuthService){}
  ngOnInit(){
   const token = localStorage.getItem('token');
   const user:User = JSON.parse(localStorage.getItem('user'));
   if(token)
   {
     const decodedtok = this.jwtHelper.decodeToken(token);
     this.authService.decodedToken = decodedtok;
   }
   if(user)
   {
     this.authService.currentUser = user;
     this.authService.changeMemberPhoto(user.photoUrl);
   }
  }
}
