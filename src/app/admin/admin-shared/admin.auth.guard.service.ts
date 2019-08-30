import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AdminShareService} from './admin.share.service';
import {AuthService} from '../../_shared/services/auth.service';

@Injectable()
export class AdminAuthGuardService implements CanActivate {
  constructor(private adminShareService: AdminShareService, private Auth: AuthService) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.Auth.isAuthenticated()) {
      return true;
    }
    this.adminShareService.clearData();
    return false;
  }

}
