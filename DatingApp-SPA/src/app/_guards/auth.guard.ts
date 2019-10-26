import { Injectable } from '@angular/core';
import { CanActivate,ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';



@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private authService:AuthService,private alertify:AlertifyService,private router:Router){}
  canActivate(next:ActivatedRouteSnapshot,state:RouterStateSnapshot):Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree{
    if(this.authService.isLoggedIn())
    {
      return true;
    }

    this.alertify.error("You have to be logged in to access!");
    this.router.navigate(['/home']);
  }
}
