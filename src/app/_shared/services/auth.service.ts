import { Injectable } from '@angular/core';
import { CookieService } from './cookie.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthService {
    constructor(private httpClient: HttpClient, private router: Router, private cookieService: CookieService) { }

    login(value) {
        return this.httpClient.post(environment.endpoint + 'auth/signin', value, { observe: 'response' })
            .pipe(
                map(
                    (response: any) => {
                        return response;
                    }
                ),
                catchError(val => throwError(val))
            )
    }

    logout() {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.getToken());
        return this.httpClient.get(environment.endpoint + 'auth/logout', { headers: headers })
            .pipe(
                map(
                    (response: any) => {
                        this.clearData();
                        return response;
                    }
                ),
                catchError(val => throwError(val))
            )
    }

    getToken() {
        return this.cookieService.getCookie('token');
    }

	getAzureId() {
        return this.cookieService.getCookie('azureId');
    }

    saveToken(token: string) {
		if (window.localStorage.getItem('keepLoginEntandem')){
			this.cookieService.setCookie('token', token, 720);
		}else{
			this.cookieService.setCookie('token', token, 12);
		}
    }

	saveAzureId(id: string) {
       this.cookieService.setCookie('azureId', id, 720);
    }

    clearData() {
        this.cookieService.setCookie('token', '', -1);
        this.cookieService.setCookie('azureId', '', -1);
        this.router.navigate(['/auth/login']);
    }

    isAuthenticated() {
        return this.getToken() !== null;
    }
}
