import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AuthService} from '../_shared/services/auth.service';
import {catchError, map} from 'rxjs/operators';
import {of, throwError} from 'rxjs';

import saveAs from 'file-saver';

@Injectable()
export class StatementsService {
  constructor(private authService: AuthService, private httpClient: HttpClient) {}
  getStatements(sortActive = null, sortDirection, currentPage, itemsPerPage = 10, startDate, endDate) {
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
    if ( startDate ) {
      const newObj = {startDate};
      sortArray.filter = {...sortArray.filter, ...newObj};
    }
    if ( endDate ) {
      const newObj = {endDate};
      sortArray.filter = {...sortArray.filter, ...newObj};
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.httpClient.post(`${environment.adminEndpoint}/profile/statements`, sortArray, {headers}).pipe(
      catchError((error) => of(''))
    );
  }

  downloadStatement(statementId: number, act: string, title: number) {
    const headers: any = {responseType: act,
      headers: new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()})
    };
    return this.httpClient.get(`${environment.adminEndpoint}/profile/statements/download/${statementId}`, headers)
      .pipe(
        map(
          (response: any) => {
            try {
              const isFileSaverSupported = !!new Blob;
            } catch (e) {
              return;
            }
            const blob = new Blob([response], { type: 'application/pdf' });
            saveAs(blob, title);
            return;
          }
        ),
        catchError(val => throwError(val))
      );
  }
}
