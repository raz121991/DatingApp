import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { User } from 'src/app/model/User';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
user:User;
  @Output() cancelEvent = new EventEmitter<void>();
  constructor(private authService:AuthService,private alertify:AlertifyService) { this.user = new User();}

  ngOnInit() {
  }



  Cancel()
  {
    this.cancelEvent.emit();
    console.log("canceled");
  }

  Register()
  {
    this.authService.register(this.user).subscribe(() => this.alertify.success('registritation successfull'),
    error => this.alertify.error(error));
  }

}
