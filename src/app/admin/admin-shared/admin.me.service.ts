import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {AuthService} from '../../_shared/services/auth.service';
import {Admin} from './admin.interfaces';


@Injectable({providedIn: 'root'})
export class AdminMeService {
  constructor(private authService: AuthService, private httpClient: HttpClient) {}
  adminInfo: Admin;
  aboutMe() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.httpClient.get(`${environment.adminEndpoint}/admin/me`, {headers} ).pipe(
      map((response: Admin) => {
        this.adminInfo = response;
        return response;
      }),
      catchError((error) => throwError(error))
    );
  }
}
