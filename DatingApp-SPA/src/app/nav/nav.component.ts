import { Component, OnInit } from '@angular/core';
import { User } from '../model/User';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
 user:User;

  constructor(private authService:AuthService) { 
    this.user = new User();
  }

  ngOnInit() {
    console.log(this.isLoggedIn())
  }

  login()
  {
    this.authService.login(this.user).subscribe(next =>{
      console.log("success");
    },error => {
      console.log(error)
    });
  }

  isLoggedIn()
{
  const token = localStorage.getItem('token');
  return !!token;
}
}
