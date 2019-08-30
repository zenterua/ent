import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../../_shared/services/auth.service';
import {environment} from '../../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {of, throwError} from 'rxjs';

import saveAs from 'file-saver';

@Injectable()
export class AdminPaymentService {
  constructor(private authService: AuthService, private httpClient: HttpClient) {}
  getPayments(sortActive = null, sortDirection, currentPage, itemsPerPage = 10, tableSearch, tableStatus, startDate, endDate) {
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
      tableStatus[0].value === 'Confirmed' ? sortArray.filter = {status: 1} : sortArray.filter = {status: 0};
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
    return this.httpClient.post(`${environment.adminEndpoint}/admin/payments`, sortArray, {headers}).pipe(
      catchError(() => of(''))
    );
  }
  exportPayments(payments: {data: string[]}) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.httpClient.post(`${environment.adminEndpoint}/admin/payments/export`, payments, {headers}).pipe(
      map((response: any) => {
        try {
          const isFileSaverSupported = !!new Blob;
        } catch (e) {
          return;
        }
        const blob = new Blob([Uint8Array.from(response.data)], { type: 'application/csv' });
        let fileName = 'Payment_history_';
        payments.data.forEach((item, index, array) => {
          if ( index === array.length - 1 ) {
            fileName += `${item}`;
          } else {
            fileName += `${item},`;
          }
        });
        saveAs(blob, `${fileName}.csv`);
        return response;
      }),
      catchError((error) => throwError((error)))
    );
  }
}
