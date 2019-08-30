import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {CookieService} from '../../_shared/services/cookie.service';
import {environment} from '../../../environments/environment';
import {AuthService} from '../../_shared/services/auth.service';

import saveAs from 'file-saver';
import {formatDate} from '@angular/common';

@Injectable()
export class AdminShareService {
  constructor(private cookieService: CookieService, private route: Router, private httpClient: HttpClient, private authService: AuthService) {}
  resetPassword() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.httpClient.get(`${environment.adminEndpoint}/admin/reset-password`, {headers}).pipe(
      catchError((error) => throwError(error))
    );
  }
  resetUserPassword(id: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.httpClient.get(`${environment.adminEndpoint}/admin/reset-password/${id}`, {headers}).pipe(
      catchError((error) => throwError(error))
    );
  }
  clearData() {
    this.cookieService.setCookie('token', '', -1);
    this.route.navigate(['/admin/login']);
  }
  setDate(d: any) {
    const s = d.split(' ').join('T');
    const t = new Date(s);
    return formatDate(t, 'MMM d, yyyy', 'en-US')
  }
  setTime(time: any) {
    let s = time.split(' ').join('T');
    let t = new Date(s);
    return formatDate(t, 'h:mm a', 'en-US')
  }
  reportDownload(type, reportId, title, act, lang?) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authService.getToken());
    return this.httpClient.get( `${environment.adminEndpoint}/admin/reports/download/${type}/${reportId}/${lang}`, {headers})
      .pipe(
        map((response: any) => {
          try {
            const isFileSaverSupported = !!new Blob;
          } catch (e) {
            return;
          }
          const blob = new Blob([Uint8Array.from(response.data)], { type: 'application/pdf' });
          if (act === 'print') {
            const blobUrl = URL.createObjectURL(blob);
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = blobUrl;
            document.body.appendChild(iframe);
            iframe.contentWindow.print();
          } else {
            saveAs(blob, title);
          }
          return response;
        }), catchError(val => throwError(val))
      );
  }

}
