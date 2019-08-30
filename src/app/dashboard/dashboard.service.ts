import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../_shared/services/auth.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  header:any
	
  constructor(private http: HttpClient, private Auth: AuthService) {
  }
   
    
  getReminders() {
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.Auth.getToken());
      return this.http.get(environment.endpoint + 'profile/reminders', { headers: headers })
        .pipe(
           map((response: any) => {
                return response;
           }), catchError(val => throwError(val)));
  }
		
}