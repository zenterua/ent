import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../_shared/services/auth.service';

@Injectable()
export class portalApis {
  header:any
	
  constructor(private http: HttpClient, private Auth: AuthService) {
  }
    
  /*REGISTRATION*/  
    
  registration(data:any) {
      return this.http.post(environment.endpoint + 'auth/register', data)
        .pipe(
           map((response: any) => {
                return response;
           }), catchError(val => throwError(val)));
  }
	
  /*REGISTRATION SOCAN MEMBER*/  	
	
  registrationMembers(data:any) {
      return this.http.post(environment.endpoint + 'auth/register-exists/', data)
        .pipe(
           map((response: any) => {
                return response;
           }), catchError(val => throwError(val)));
  }	
	
  /*USER VERIFICATION*/	
	
  registrationConfirm(token:string) {
      return this.http.get(environment.endpoint + 'auth/register-confirm/' + token)
        .pipe(
           map((response: any) => {
                return response;
           }), catchError((val) => throwError(val)));
  }
	
  /*USER RESEND VERIFICATION*/
	
  resendRegistrationConfirm(id:string, lang:string) {
      return this.http.get(environment.endpoint + 'auth/resend-register-confirm/' + id + '/' + lang)
        .pipe(
           map((response: any) => {
                return response;
           }), catchError((val) => throwError(val)));
  }
	
  /*FORGOT PASSWORD*/
	
  forgotPassword(email:any, lang:string) {
      return this.http.post(environment.endpoint + 'auth/reset-password-email/' + lang, email)
        .pipe(
           map((response: any) => {
                return response;
           }), catchError((val) => throwError(val)));
  }
	
  /*CHECK EMAIL EXIST*/	
	
  emailExist(email:any) {
      return this.http.post(environment.endpoint + 'auth/check-email', email)
        .pipe(
           map((response: any) => {
                return response;
           }), catchError((val) => throwError(val)));
  }	

  /*RESET PASSWORD*/	
	
  resetPassword(password:any, token:any) {
      return this.http.post(environment.endpoint + 'auth/reset-password/' + token, password)
        .pipe(
           map((response: any) => {
                return response;
           }), catchError((val) => throwError(val)));
  }
	
  /*CHANGE EMAIL*/	
	
  confirmChangeEmail(token:any) {
      return this.http.get(environment.endpoint + 'profile/account/change-email/' + token)
        .pipe(
           map((response: any) => {
                return response;
           }), catchError((val) => throwError(val)));
  }
    
  /*CHECK TOKEN*/	
	
  checkToken(token:any) {
      return this.http.get(environment.endpoint + 'auth/check-valid/' + token)
        .pipe(
           map((response: any) => {
                return response;
           }), catchError((val) => throwError(val)));
  }    
   
}