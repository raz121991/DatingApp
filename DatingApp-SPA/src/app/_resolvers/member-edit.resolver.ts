import { Injectable } from "@angular/core";
import { UserService } from '../_services/user.service';
import { Resolve, Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../model/User';
import { AlertifyService } from '../_services/alertify.service';
import { Observable,of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

@Injectable()

export class MemberEditResolver implements Resolve<User>{
    constructor(private userService:UserService,private router:Router,route:ActivatedRoute,private alertify:AlertifyService,private authService:AuthService){}

    resolve(route:ActivatedRouteSnapshot): Observable<User>{

        return this.userService.getUser(this.authService.decodedToken.nameid).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving user data');
                this.router.navigate(['/members']);
                return of(null);
            })
        )
    }
}