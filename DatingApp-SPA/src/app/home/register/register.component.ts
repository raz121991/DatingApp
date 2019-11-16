import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UserDto } from 'src/app/model/UserDto';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { User } from 'src/app/model/User';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
user:User;
registerForm:FormGroup;
bsConfig:Partial<BsDatepickerConfig>;

  @Output() cancelEvent = new EventEmitter<void>();
  constructor(private authService:AuthService,private alertify:AlertifyService,private fb:FormBuilder,private router:Router) { 
  }

  ngOnInit() {
    this.bsConfig = {
      containerClass: 'theme-blue'
    };
    this.createRegisterForm();
  }

createRegisterForm(){
  this.registerForm = this.fb.group({
    gender:['male'],
    username: ['',Validators.required],
    knownAs:['',Validators.required],
    dateOfBirth:[null,Validators.required],
    city:['',Validators.required],
    country:['',Validators.required],
    password:['',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]],
    confirmpassword:['',Validators.required]
  },{validator:this.passwordMatchValidator})
}
passwordMatchValidator(form:FormGroup){
  return form.get('password').value === form.get('confirmpassword').value ? null : {'mismatch':true};
}

  Cancel()
  {
    this.cancelEvent.emit();
    console.log("canceled");
  }

  Register()
  {
    if(this.registerForm.valid){
      this.user = Object.assign({},this.registerForm.value);
      this.authService.register(this.user).subscribe(
      () => {
        this.alertify.success("Registration succesfull");
      },error => this.alertify.error(error),() => {
        const userDto = new UserDto();
        userDto.username = this.user.username;
        userDto.password = this.registerForm.get('password').value;
        this.authService.login(userDto).subscribe(()=>{
          this.router.navigate(['/members'])
        });
      }
      );
    }
  }

}
