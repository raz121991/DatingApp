import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { NavComponent } from './nav/nav.component';
import {FormsModule} from '@angular/forms';
import { AuthService } from './_services/auth.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './home/register/register.component';
import {ErrorInterceptorProvider} from './_services/error.interceptor';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
   declarations: [
      AppComponent,
      RegisterComponent,
      NavComponent,
      HomeComponent
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      FormsModule,
      BrowserAnimationsModule,
      BsDropdownModule.forRoot()
   ],
   providers: [AuthService, ErrorInterceptorProvider],
   bootstrap: [AppComponent]
})
export class AppModule { }
