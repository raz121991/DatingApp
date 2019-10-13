import { Component, OnInit } from '@angular/core';
import { User } from '../model/User';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
 user:User;

  constructor(public authService:AuthService,private alertify:AlertifyService) { 
    this.user = new User();
  }

  ngOnInit() {
    console.log(this.isLoggedIn())
  }

  login()
  {
    this.authService.login(this.user).subscribe(next =>{
      this.alertify.success("logged in successfully");
    },error => {
      this.alertify.error(error);
    });
  }

  isLoggedIn()
  {
    return this.authService.isLoggedIn();
  }
}
