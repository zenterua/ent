import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {AuthService} from '../../_shared/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminRedirectGuard implements CanActivate {
    constructor(private Auth: AuthService, private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.Auth.isAuthenticated()) {
            this.router.navigate(['/admin/dashboard']);
            return false;
        }
        return true;
    }
}
