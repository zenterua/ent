import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../_shared/services/auth.service';

@Injectable({ providedIn: 'root' })
export class MakePaymentService {
  header:any
	
  constructor(private http: HttpClient, private Auth: AuthService) {}
	
  pay(data) {
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.Auth.getToken());
      return this.http.post(environment.endpoint + 'profile/make-payment',  data, { headers: headers })
        .pipe(
           map((response: any) => {
                return response;
           }), catchError(val => throwError(val)));
  }
	
  getPayment(id) {
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.Auth.getToken());
      return this.http.get(environment.endpoint + 'profile/payment/detail/' + id, { headers: headers })
        .pipe(
           map((response: any) => {
                return response;
           }), catchError(val => throwError(val)));
  }
	
  getContacts() {
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.Auth.getToken());
      return this.http.get(environment.endpoint + 'profile/account/contacts', { headers: headers })
        .pipe(
           map((response: any) => {
                return response;
           }), catchError(val => throwError(val)));
  }
	
  sendPayment(users, lang) {
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.Auth.getToken());
      return this.http.post(environment.endpoint + 'profile/send-payment-receipt/' + lang, users, { headers: headers })
        .pipe(
           map((response: any) => {
                return response;
           }), catchError(val => throwError(val)));
  }	
		
}