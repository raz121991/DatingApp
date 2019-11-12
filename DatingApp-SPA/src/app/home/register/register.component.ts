import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UserDto } from 'src/app/model/UserDto';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
user:UserDto;
  @Output() cancelEvent = new EventEmitter<void>();
  constructor(private authService:AuthService,private alertify:AlertifyService) { 
    this.user = new UserDto();
  }

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
