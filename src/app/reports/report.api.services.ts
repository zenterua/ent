import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../_shared/services/auth.service';

import saveAs from 'file-saver';

@Injectable()
export class ReportApiServices {
  header:any

  constructor(private http: HttpClient, private Auth: AuthService) {}

  reports(isDraft, sort = null, paginator, tableSearch, tableStatus, startDate, endDate) {
	const sortArray = {
	  currentPage:paginator ? paginator.pageIndex + 1 : 1,
	  itemsPerPage:paginator ? paginator.pageSize : 10,
	  filter: {},
	  sort: {}
	};
	if ( sort && sort.direction !== '') {
	  const newObj = {[sort.active]: sort.direction};
	  sortArray.sort = {...sortArray.sort, ...newObj};
	}
	if ( tableStatus ) {
	    sortArray.filter = {tariffGroup: [...tableStatus]}
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
     return this.http.post(environment.endpoint + 'profile/report/all/' + isDraft, sortArray, { headers: headers })
       .pipe(
	   map((response: any) => {
			return response;
	   }), catchError(val => throwError(val)));
  }

  reportDetail(type, reportId) {
     const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.Auth.getToken());
     return this.http.get(environment.endpoint + 'profile/report/detail/' + type + '/' + reportId, { headers: headers })
       .pipe(
	   map((response: any) => {
			return response;
	   }), catchError(val => throwError(val)));
  }

  removeDraftReport(type, reportId) {
     const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.Auth.getToken());
     return this.http.get(environment.endpoint + 'profile/report/delete/' + type + '/' + reportId, { headers: headers })
       .pipe(
	   map((response: any) => {
			return response;
	   }), catchError(val => throwError(val)));
  }

  calculate(tariffSeq, tariff) {
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.Auth.getToken());
      return this.http.post(environment.endpoint + 'profile/report/send/' + tariffSeq, tariff, { headers: headers })
        .pipe(
           map((response: any) => {
                return response;
           }), catchError(val => throwError(val)));
  }

  reportDownload(type, reportId, title, act, lang?) {
     const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.Auth.getToken());
     return this.http.get(environment.endpoint + 'profile/report/download/' + type + '/' + reportId + '/' + lang, { headers: headers })
       .pipe(
	   map((response: any) => {
			try {
					let isFileSaverSupported = !!new Blob;
				} catch (e) {
					return;
				}
				let blob = new Blob([Uint8Array.from(response.data)], { type: 'application/pdf' });
		        if (act == 'print'){
					const blobUrl = URL.createObjectURL(blob);
				    const iframe = document.createElement('iframe');
				    iframe.style.display = 'none';
				    iframe.src = blobUrl;
				    document.body.appendChild(iframe);
				    iframe.contentWindow.print();
				}else{
					saveAs(blob, title);
				}
				return;
	   }), catchError(val => throwError(val)));

  }


}
