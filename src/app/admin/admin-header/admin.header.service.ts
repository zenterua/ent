import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {AuthService} from '../../_shared/services/auth.service';
import {AdminShareService} from '../admin-shared/admin.share.service';

@Injectable()
export class AdminHeaderService {
  constructor(private httpClient: HttpClient, private authService: AuthService, private adminShareService: AdminShareService) {}
  logOut() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.httpClient.get(`${environment.adminEndpoint}/auth/logout`, {headers}).pipe(
      map(
        (response: any) => {
          this.adminShareService.clearData();
          return response;
        }
      ),
      catchError((error) => throwError(error))
    );
  }
}
