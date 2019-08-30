import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {of, throwError} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AuthService} from '../../_shared/services/auth.service';

import saveAs from 'file-saver';

@Injectable()
export class AdminUserManagementService {
  constructor(private httpClient: HttpClient, private authService: AuthService) {}
  dashboardManagement(sortActive = null, sortDirection, currentPage, itemsPerPage = 10, tableSearch, tableStatus, startDate, endDate) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    const sortArray = {
      currentPage,
      itemsPerPage,
      filter: {},
      sort: {}
    };
    if ( sortDirection !== '' ) {
      const newObj = {[sortActive]: sortDirection};
      sortArray.sort = {...sortArray.sort, ...newObj};
    }
    if ( tableStatus.length && tableStatus.length < 2 ) {
      tableStatus[0].value === 'Active' ? sortArray.filter = {status: 1} : sortArray.filter = {status: 0};
    }
    if ( startDate ) {
      const newObj = {startDate};
      sortArray.filter = {...sortArray.filter, ...newObj};
    }
    if ( endDate ) {
      const newObj = {endDate};
      sortArray.filter = {...sortArray.filter, ...newObj};
    }
    if ( tableSearch ) {
      const newObj = {name: tableSearch};
      sortArray.filter = {...sortArray.filter, ...newObj};
    }
    return this.httpClient.post(`${environment.adminEndpoint}/admin/users`, sortArray, {headers}).pipe(
      catchError(() => of(''))
    );
  }
  chageAccountStatus(accountData: {id: string; status: number}) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.httpClient.post(`${environment.adminEndpoint}/admin/user/status`, accountData, {headers}).pipe(
      catchError((error) => throwError(error))
    );
  }
  getUserInfo(userId) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.httpClient.get(`${environment.adminEndpoint}/admin/user/info/${userId}`, {headers}).pipe(
      catchError((error) => throwError(error))
    );
  }
  resetUserPassword(userId) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.httpClient.get(`${environment.adminEndpoint}/admin/reset-password/${userId}`, {headers}).pipe(
      catchError((error) => throwError(error))
    );
  }
  exportUsers(users: {data: string[]}) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.httpClient.post(`${environment.adminEndpoint}/admin/users/export`, users, {headers}).pipe(
      map((response: any) => {
        try {
          const isFileSaverSupported = !!new Blob;
        } catch (e) {
          return;
        }
        const blob = new Blob([Uint8Array.from(response.data)], { type: 'application/csv' });
        saveAs(blob, `Users_${users.data[0]}.csv`);
        return response;
      }),
      catchError((error) => throwError((error)))
    );
  }
}
