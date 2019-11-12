import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/model/User';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  user:User;
  photoUrl:string;
  @HostListener('window:beforeunload',['$event'])
  unloadNotification($event:any){
    if(this.editForm.dirty){
      $event.returnValue = true;
    }
  }
  constructor(private route:ActivatedRoute,private alertify:AlertifyService,private userService:UserService,private authService:AuthService) { }
@ViewChild('editForm') editForm:NgForm;
  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(
      (mainPhotoUrl:string) => this.photoUrl = mainPhotoUrl
    );

    this.route.data.subscribe(
    (data:any) => this.user = data['user']
    );
  }

  updateUser()
  {
    this.userService.updateUser(this.user.id,this.user).subscribe(
      (result:any) => {
        this.alertify.success('profile updated successfully');
        this.editForm.reset(this.user);
      },error => this.alertify.error(error)
    );
   
  }

}
