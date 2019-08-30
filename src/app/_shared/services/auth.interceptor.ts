import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ActivatedRoute } from '@angular/router';
import  {AdminShareService } from '../../admin/admin-shared/admin.share.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router, private Auth: AuthService, private route: ActivatedRoute, private adminShareService: AdminShareService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const token:any = this.Auth.getToken();
		const azureId:any = this.Auth.getAzureId();

        if (token) {
            request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
        }
		
		if (!request.headers.has('Content-Type')) {
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }
		
		if (azureId) {
            request = request.clone({ headers: request.headers.set('Impersionate', azureId) });
        }
		
        return next.handle(request).pipe(
            tap(
                (event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    let newToken = event.headers.get('Authorization');
                    let oldToken = this.Auth.getToken();
                    if (newToken) {
                        if (newToken !== oldToken) {
                            this.Auth.saveToken(event.headers.get('Authorization'));
                        }
                    }
                }
                }, (err: any) => {
                    if (err instanceof HttpErrorResponse) {
                        if (err.status === 401) {
								if (this.router.url.includes('/admin')){
								    this.adminShareService.clearData();
								}else{
									this.Auth.clearData();
								}
                            console.log('%c UNAUTHORIZED /!\\ ', 'border: 1px red solid; color: red;');
                        }
                    }
                }
            )
        );
    }
}
