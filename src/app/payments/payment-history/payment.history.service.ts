import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../_shared/services/auth.service';

@Injectable({ providedIn: 'root' })
export class PaymentHistoryService {
  header:any

  constructor(private http: HttpClient, private Auth: AuthService) {}

  getAllPayments(sort = null, paginator, tableSearch, tableStatus, startDate, endDate) {
	    const sortArray = {
		  currentPage:paginator ? paginator.pageIndex + 1 : 1,
		  itemsPerPage:paginator ? paginator.pageSize : 10,
		  filter: {},
		  sort: {}
		};

	    if ( sort && sort.active) {
		  const newObj = {[sort.active]: sort.direction};
		   sortArray.sort = {...sortArray.sort, ...newObj};
		}else{
			sortArray.sort = {};
		}

		if (tableStatus && tableStatus[0] && tableStatus.length < 2 ) {
			(tableStatus[0].value == 'Confirmed' || tableStatus[0].value == 'Confirmée') ? sortArray.filter = {status: 1} : sortArray.filter = {status: 0};
		}else{
			sortArray.filter = {}
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
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.Auth.getToken());
        return this.http.post(environment.endpoint + 'profile/payments', sortArray, { headers: headers })
        .pipe(
           map((response: any) => {
                return response;
           }), catchError(val => throwError(val)));
  }

}
