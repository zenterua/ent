import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../_shared/services/auth.service';

@Injectable()
export class TariffDetailService {
  header:any
	
  constructor(private http: HttpClient, private Auth: AuthService) {
  }
	
  getDetail(tariffSeq) {
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.Auth.getToken());
      return this.http.get(environment.endpoint + 'profile/tariff/detail/' + tariffSeq, { headers: headers })
        .pipe(
           map((response: any) => {
                return response;
           }), catchError(val => throwError(val)));
  }
	
  getTax(province) {
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.Auth.getToken());
      return this.http.get(environment.endpoint + 'profile/tariff/tax/' + province, { headers: headers })
        .pipe(
           map((response: any) => {
                return response;
           }), catchError(val => throwError(val)));
  }	

		
}