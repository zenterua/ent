import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import { HeaderService } from './header/header.service';
import {itemAnimation, routerAnimation} from './_shared/animations';
import { trigger } from '@angular/animations';
import { RouterUrlService } from './_shared/services/router.url.service';
import {ImpersonationHeaderService} from './_shared/services/impersonation.header.service';
import {CookieService} from './_shared/services/cookie.service';
import {filter} from 'rxjs/operators';

declare global {
    interface Window { dataLayer: any[]; }
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [
        trigger('routerAnimation', routerAnimation ),
        trigger('itemAnimation', itemAnimation)
  ]	
})
export class AppComponent implements OnInit {
  title = 'Entandem';
  isLoaded: boolean;
  base: string = "";
  displayNav: boolean = false;
  userAgentPhone: boolean = false;
  noTransition:boolean;
  headerOpened: boolean = false;
  isLoading: boolean = false;
  displayAdmin: boolean = false;
  impersonationModeActive = false;
  dataLayer:any[] = [];
	
  constructor(private router: Router, private routerUrlService: RouterUrlService, private headerService: HeaderService, private titleService: Title, private impersonationService: ImpersonationHeaderService, private cookieService: CookieService) {
        this.headerService.headerOpened.subscribe(value => {
            this.noTransition = true;
            this.headerOpened = value;
            setTimeout(()=>{this.noTransition = false},0);
        });
        
        this.router.events.subscribe((evt) => {
            if (evt instanceof RouteConfigLoadStart) {
                this.isLoaded = false;
            } else if (evt instanceof RouteConfigLoadEnd) {
                this.isLoaded = true;
            }
        });
	  
	    this.router.events.pipe(
			filter(event => event instanceof NavigationEnd),
		).subscribe((evt:any) => {
			this.dataLayer.push({
				event: 'ngRouteChange',
				attributes: {
					route: evt.urlAfterRedirects
				}
			});
		});
    }

    getRouteAnimation(outlet) {
        return outlet.activatedRouteData.animation
    }

    ngOnInit() {
        this.userAgentPhone = (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)) ? true : false;
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            this.isLoaded = true;
            window.scrollTo(0, 0);
            this.base = this.router.url;

			if (this.base.includes('login')){
				this.titleService.setTitle('Entandem | Login');
			}
			
			if (this.base.includes('forgotpassword')){
				this.titleService.setTitle('Entandem | Forgot Password');
			}
			
			if (this.base.includes('register')){
				this.titleService.setTitle('Entandem | Register Now');
			}
			
			if (this.base.includes('dashboard')){
				this.titleService.setTitle('Entandem | Dashboard');
			}
			
			if (this.base.includes('new-report')){
				this.titleService.setTitle('Entandem | Submit New');
			}
			
			if (this.base.includes('draft-reports')){
				this.titleService.setTitle('Entandem | Drafts');
			}
			
			if (this.base.includes('submitted-reports')){
				this.titleService.setTitle('Entandem | Report History');
			}
			
			if (this.base.includes('make-payment')){
				this.titleService.setTitle('Entandem | Make a Payment');
			}

			if (this.base.includes('payment-history')){
				this.titleService.setTitle('Entandem | Payment History');
			}
			
			if (this.base.includes('invoices')){
				this.titleService.setTitle('Entandem | Invoices');
			}
			
			if (this.base.includes('statements')){
				this.titleService.setTitle('Entandem | Statements');
			}
			
			if (this.base.includes('support')){
				this.titleService.setTitle('Entandem | Support');
			}
			
			if (this.base.includes('assign-tariff')){
				this.titleService.setTitle('Entandem | Music Licenses');
			}
			
			if (this.base.includes('account')){
				this.titleService.setTitle('Entandem | My Account');
			}
			
            if (this.base.includes('login') || this.base.includes('forgotpassword') || this.base.includes('resetpassword') || this.base.includes('confirmation') || this.base.includes('register') || this.base.includes('admin/login') || this.base.includes('admin/forgotpassword')) {
				this.displayNav = false;
				this.displayAdmin = false;
			} else if (this.base.includes('admin')) {
				this.displayNav = false;
				this.displayAdmin = true;
			} else {
				this.displayNav = true;
				this.displayAdmin = false;
			}
			
            this.routerUrlService.setRouterUrl(this.router.url);
        });

        if ( this.cookieService.getCookie('azureId') ) {
          this.impersonationModeActive = true;
        }
        this.impersonationService.watchImpersonationStart().subscribe((data) => {
          this.impersonationModeActive = data;
        });
    }	
}
