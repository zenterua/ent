import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../_shared/services/auth.service';

@Injectable()
export class TariffsService {
  header:any
	
  constructor(private http: HttpClient, private Auth: AuthService) {
  }
   
  /*Get all tariffs*/
	
  getAllTariffs() {
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.Auth.getToken());
      return this.http.get(environment.endpoint + 'profile/tariff/all', { headers: headers })
        .pipe(
           map((response: any) => {
                return response;
           }), catchError(val => throwError(val)));
  }
	
  /*Assign tariff*/
	
  assignTariff(tariff, tariffSeq) {
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.Auth.getToken());
      return this.http.post(environment.endpoint + 'profile/tariff/assign/' + tariffSeq, tariff, { headers: headers })
        .pipe(
           map((response: any) => {
                return response;
           }), catchError(val => throwError(val)));
  }	
	
  /*User assigned tariffs*/
	
  assignedAllTariffs(active) {
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.Auth.getToken());
      return this.http.get(environment.endpoint + 'profile/tariff/user-tariffs/' + active, { headers: headers })
        .pipe(
           map((response: any) => {
                return response;
           }), catchError(val => throwError(val)));
  }
	
  /*Get tariff unit*/
	
  getUnit(tariffSeq) {
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.Auth.getToken());
      return this.http.get(environment.endpoint + 'profile/tariff/user-tariff-units/' + tariffSeq, { headers: headers })
        .pipe(
           map((response: any) => {
                return response;
           }), catchError(val => throwError(val)));
  }		
	
  /*Add unit*/
	
  addUnit(unit, tariffSeq) {
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.Auth.getToken());
      return this.http.post(environment.endpoint + 'profile/tariff/add-unit/' + tariffSeq, unit, { headers: headers })
        .pipe(
           map((response: any) => {
                return response;
           }), catchError(val => throwError(val)));
  }		
		
}