import { Component, OnInit, Input } from '@angular/core';
import { Photo } from 'src/app/model/Photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';


@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
@Input() photos:Photo[];
  uploader:FileUploader;
  hasBaseDropZoneOver:boolean;
  baseUrl = environment.apiUrl;

  constructor(private authService:AuthService,private userService:UserService,private alertify:AlertifyService) { }

  ngOnInit() {
    this.initializeUploader();
  }

   fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

   initializeUploader()
  {
    this.uploader = new FileUploader({
      url: this.baseUrl + "users/" + this.authService.decodedToken.nameid + '/photos',
      authToken:'Bearer ' + localStorage.getItem('token'),
      isHTML5:true,
      allowedFileType:['image'],
      removeAfterUpload:true,
      autoUpload:false,
      maxFileSize:10* 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {file.withCredentials = false;};

    this.uploader.onSuccessItem = (item,response,status,header) => {
      if(response){
        const res:Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          description: res.description,
          dateAdded: res.dateAdded,
          isMain: res.isMain,
          url: res.url
        }
        this.photos.push(photo);
        if(photo.isMain)
        {
          this.authService.changeMemberPhoto(photo.url);
        this.authService.currentUser.photoUrl = photo.url;
        localStorage.setItem('user',JSON.stringify(this.authService.currentUser));
        }
      }
    }
  }

  
  SetMainPhoto(photo:Photo)
  {
    var userId= this.authService.decodedToken.nameid;
    this.userService.setMainPhoto(photo.id,userId).subscribe(
      () => {
        let currMain = this.photos.filter(p => p.isMain === true)[0];
        currMain.isMain = false;

        photo.isMain = true;
        this.authService.changeMemberPhoto(photo.url);
        this.authService.currentUser.photoUrl = photo.url;
        localStorage.setItem('user',JSON.stringify(this.authService.currentUser));

      },error => this.alertify.error(error)
    );
  }

  deletePhoto(id:number)
  {
    this.alertify.confirm("Are you sure you want to delete this photo?",() => {
      this.userService.deletePhoto(id,this.authService.decodedToken.nameid).subscribe(
        () => {
          this.alertify.success("deleted photo succesfully");
          this.photos.splice(this.photos.findIndex(p => p.id === id),1);
        },error => this.alertify.error(error)
        
      )
    }
    )
  }
}
