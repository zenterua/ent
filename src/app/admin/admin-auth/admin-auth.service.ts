import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

@Injectable()
export class AdminAuthService {
  constructor(private httpClient: HttpClient, private route: Router) {}
  login(loginValue: {email: string, password: string}) {
    return this.httpClient.post(`${environment.adminEndpoint}/auth/signin`, loginValue ).pipe(
      map((response: boolean) => {
          this.route.navigate(['/admin/dashboard']);
          return response;
      }),
      catchError((error) => throwError(error))
    );
  }
  forgotPassword(email: {email: string}, language: string) {
    return this.httpClient.post(`${environment.adminEndpoint}/auth/reset-password-email/${language}`, email).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error) => throwError(error)));
  }
  resetPassword(formData: {password: string, passwordRepeat: string}, requireToken: string) {
    return this.httpClient.post(`${environment.adminEndpoint}/auth/reset-password/${requireToken}`, formData).pipe(
      map((response) => {
        // if ( response ===  )
        return response;
      }),
      catchError( (error) => throwError(error))
    );
  }
}
