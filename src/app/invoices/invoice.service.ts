import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../_shared/services/auth.service';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  header:any

  constructor(private http: HttpClient, private Auth: AuthService) {}

  getAllInvoices(sortActive = null, sortDirection, currentPage, itemsPerPage = 10, tableSearch, tableStatus, startDate, endDate) {
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
	if (tableStatus && tableStatus[0] && tableStatus.length < 2 ) {
	    (tableStatus[0].value == 'Paid' || tableStatus[0].value == 'Payé') ? sortArray.filter = {status: 'Y'} : sortArray.filter = {status: 'N'};
	}else{
		sortArray.filter = {status: ''}
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
	  const newObj = {number: tableSearch};
	  sortArray.filter = {...sortArray.filter, ...newObj};
	}
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.Auth.getToken());
    return this.http.post(environment.endpoint + 'profile/invoice', sortArray, { headers: headers })
       .pipe(
	   map((response: any) => {
			return response;
	   }), catchError(val => throwError(val)));
  }


}
