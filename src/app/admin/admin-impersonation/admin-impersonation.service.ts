import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs';
import {AuthService} from '../../_shared/services/auth.service';

@Injectable()
export class AdminImpersonationService {
  constructor(private authService: AuthService, private httpClient: HttpClient) {}
  dashboardUsers(sortActive = null, sortDirection, currentPage, itemsPerPage = 10, tableSearch, startDate, endDate) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    const sortArray = {
      currentPage,
      itemsPerPage,
      filter: {status: 1},
      sort: {}
    };
    if ( sortDirection !== '' ) {
      const newObj = {[sortActive]: sortDirection};
      sortArray.sort = {...sortArray.sort, ...newObj};
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
    return this.httpClient.post(`${environment.adminEndpoint}/admin/users`, sortArray, {headers}).pipe(
      catchError(() => of(''))
    );
  }
}
