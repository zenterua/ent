import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../../_shared/services/auth.service';
import {environment} from '../../../environments/environment';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable()
export class AdminReportsService {
  constructor(private httpClient: HttpClient, private authService: AuthService) {}
  getReports(sortActive = null, sortDirection, currentPage, itemsPerPage = 10, tableSearch, tableStatus, startDate, endDate) {
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
      if ( tableStatus[0].value.toLowerCase() === 'submitted' ) {
        sortArray.filter = {status: 'N'};
      } else if ( tableStatus[0].value.toLowerCase() === 'draft' ) {
        sortArray.filter = {status: 'Y'};
      }
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
    return this.httpClient.post(`${environment.adminEndpoint}/admin/reports`, sortArray, {headers}).pipe(
      catchError((error) => throwError(error))
    );
  }
  getDetailReport(type: string, id: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.httpClient.get(`${environment.adminEndpoint}/admin/reports/detail/${type}/${id}`, {headers}).pipe(
      catchError((error) => throwError(error))
    );
  }
  deleteDraftReport(type: string, id: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.httpClient.get(`${environment.adminEndpoint}/admin/draft-report/delete/${type}/${id}`, {headers}).pipe(
      catchError((error) => throwError(error))
    );
  }
}
