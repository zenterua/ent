import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from '@angular/router';
import { Subscription } from 'rxjs';
import {CookieService} from '../_shared/services/cookie.service';
import {UserDataService} from '../header/user.data.service';
import { User } from '../admin/admin-shared/admin.interfaces';
import {ImpersonationHeaderService} from '../_shared/services/impersonation.header.service';

@Component({
  selector: 'app-impersonation-header',
  templateUrl: './impersonation-header.component.html',
  styleUrls: ['./impersonation-header.component.scss']
})
export class ImpersonationHeaderComponent implements OnInit, OnDestroy {
  impersonationUser: User;
  impersonationTime = new Date();
  private userSub:Subscription;		
  userIp:any;	
  adminId:any;	
  constructor(private route: Router,
              private cookieService: CookieService,
              private userDataService: UserDataService,
              private ImpersonationService: ImpersonationHeaderService) { }

  ngOnInit() {
    this.userSub = this.userDataService.currentData.subscribe((data) => {
      this.impersonationUser = data;
    });
	 
    if (this.cookieService.getCookie('adminId')){
		this.adminId = this.cookieService.getCookie('adminId');
	}

  }
	
  ngOnDestroy() {
	  if (this.userSub){this.userSub.unsubscribe();}
  }
	
  moveToAdmin() {
    this.cookieService.deleteCookie('azureId');
    this.cookieService.deleteCookie('adminId');
    this.ImpersonationService.impersonationStart(false);
    this.route.navigate(['/admin/impersonation']);
  }
}
