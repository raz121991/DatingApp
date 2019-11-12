import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/User';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  user:User;

  galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];
    
  constructor(private userService:UserService,private alertify:AlertifyService,
    private route:ActivatedRoute) { }

  ngOnInit() {
     this.route.data.subscribe(
       (data:any) => {
         this.user = data['user'];
       } 
     );
       this.galleryOptions = [
         {
           width:'500px',
           height:'500px',
           imagePercent:100,
           thumbnailsColumns:4,
           imageAnimation:NgxGalleryAnimation.Slide,
           preview:false
         }
       ];

       this.galleryImages = this.getImages();
  }
  getImages(){
    const imageUrls = [];
    for (const pic of this.user.photos) {
      imageUrls.push({
        small:pic.url,
        medium:pic.url,
        large:pic.url
      })
    }
    return imageUrls;
  }

  // loadUser()
  // {
  //   this.userService.getUser(+this.route.snapshot.params['id']).subscribe(
  //   (user:User) => {
  //     this.user = user
  //   },error => this.alertify.error(error)
  //   );
  // }

}
