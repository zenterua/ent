import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../../_shared/services/auth.service';
import {environment} from '../../../environments/environment';
import {catchError} from 'rxjs/operators';
import {of, throwError} from 'rxjs';

@Injectable()
export class AdminAccountsService {
  constructor(private httpClient: HttpClient, private authService: AuthService) {}
  adminsDashboard(sortActive = null, sortDirection, currentPage, itemsPerPage = 10, tableSearch, tableStatus, startDate, endDate) {
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
      const newObj = {name: tableSearch.split(' ').filter(item => item !== '')};
      sortArray.filter = {...sortArray.filter, ...newObj};
    }
    return this.httpClient.post(`${environment.adminEndpoint}/admin/staff`,  sortArray, {headers}).pipe(
      catchError((error) => of(''))
    );
  }
  chageAccountStatus(accountData) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.httpClient.post(`${environment.adminEndpoint}/admin/staff/status`, accountData, {headers}).pipe(
      catchError((error) => throwError(error))
    );
  }
  editAccount(accountData) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.httpClient.post(`${environment.adminEndpoint}/admin/staff/save`, accountData, {headers}).pipe(
      catchError((error) => throwError(error))
    );
  }
  createAccount(accountData) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.httpClient.post(`${environment.adminEndpoint}/admin/staff/add` , accountData, {headers}).pipe(
      catchError((error) =>  throwError(error))
    );
  }
  removeAccout(accountData) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.httpClient.post(`${environment.adminEndpoint}/admin/staff/remove`, accountData, {headers}).pipe(
      catchError((error) => throwError(error))
    );
  }
  getAdminInfo(accountData) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.httpClient.get(`${environment.adminEndpoint}/admin/staff/info/${accountData}`, {headers}).pipe(
      catchError((error) => throwError(error))
    );
  }
}
