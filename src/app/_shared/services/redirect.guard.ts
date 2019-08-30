import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RedirectGuard implements CanActivate {
    constructor(private Auth: AuthService, private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.Auth.isAuthenticated()) {
            this.router.navigate(['/reports/new-report']);
            return false;
        }
        return true;
    }
}