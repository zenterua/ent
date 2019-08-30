import { Component, OnInit, Input, OnDestroy, ViewEncapsulation, HostListener, LOCALE_ID, Inject, ViewChild } from '@angular/core';
import { trigger } from '@angular/animations';
import { Subscription } from 'rxjs';
import { animationPopup, animationHeader } from '../_shared/animations';
import { HeaderService } from './header.service';
import { UserDataService } from './user.data.service';
import { LicensessService } from './licensee.service';
import { AuthService } from '../_shared/services/auth.service';
import { RouterUrlService } from '../_shared/services/router.url.service';
import { finalize } from 'rxjs/operators';
import { SnackBarComponent } from '../_shared/components/snack-bar/snack-bar.component';
import { ReportCounterService } from '../reports/draft-reports/report.counter.service';
import { ReportApiServices } from '../reports/report.api.services';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('animationHeader', animationHeader),
        trigger('animationPopup', animationPopup)
    ]
})
export class HeaderComponent implements OnInit, OnDestroy {
    userMenuOpened: boolean;
    slideMenuOpened: boolean;
    rsMenuOpened: boolean = true;
    logoutPopupOpened: boolean;
    headerHovered: boolean;
    routerUrlSubscription: Subscription;
    routerUrl: string;
    scrolled: boolean;
    userName: string;
    loaderIsVisible: boolean;
    reportNumb: number;
    @ViewChild(SnackBarComponent) snackComponent: SnackBarComponent;
    routerCallbackSubscription: Subscription;
    drafftNumber: Subscription;
    frenchPopupOpened: boolean;
    textErrorImpersionate: string;
    textError: string;
    languages = [
        { 'code': 'en-US', 'text': 'EN', 'url': '' },
        { 'code': 'fr', 'text': 'FR', 'url': '' }
    ];

    @HostListener('window:scroll', ['$event']) handleScroll() {
        this.onScrollHeader();
    }

    constructor(private Auth: AuthService, private headerService: HeaderService, private routerUrlService: RouterUrlService, private licensessService: LicensessService, private userDataService: UserDataService, private reportCounterService: ReportCounterService, @Inject(LOCALE_ID) public localeId: string, private reportApiServices: ReportApiServices) {
        if (this.localeId === 'fr') {
            this.textError = 'Une erreur s’est produite';
            this.textErrorImpersionate = 'Vous ne pouvez pas effectuer cette action dans le mode mandataire';
        } else {
            this.textError = 'An Unexpected Error Occurred';
            this.textErrorImpersionate = 'Action is not allowed in Impersonation mode';
        }
    }

    ngOnInit() {
        this.routerCallbackSubscription = this.routerUrlService.routerCallback.subscribe((value) => {
            this.languages[0].url = window.location.href.replace('/fr/', '/en/');
            this.languages[1].url = window.location.href.replace('/en/', '/fr/');
        });

        this.drafftNumber = this.reportCounterService.currentNumber
		.subscribe((value) => {
			this.reportNumb = value;			
		});
		
		this.reportApiServices.reports(1, null, { pageSize: 0, pageIndex: 0 }, null, null, null, null)
		.subscribe((response: any) => {
			if (response.reports) {
				this.reportNumb = response.total;
				this.reportCounterService.changeNumber(+this.reportNumb);
			}
		});
		
        this.routerUrlSubscription = this.routerUrlService.getRouterUrl().subscribe(value => {
            this.routerUrl = value;
            this.userMenuOpened = false;
            this.rsMenuOpened = true;
        });

        this.licensessService.getInfo().subscribe((data) => {
            if (data) {
                this.userDataService.changeData(data);
                this.userName = data.FIRST_NAME[0].toString() + data.LAST_NAME[0].toString();
            }
        });
    }

    onScrollHeader() {
        const windowScroll = window.pageYOffset;
        if (windowScroll > 120) {
            this.scrolled = true;
        } else {
            this.scrolled = false;
        }
    }

    ngOnDestroy() {
        if (this.routerCallbackSubscription){this.routerCallbackSubscription.unsubscribe();}
        if (this.routerUrlSubscription){this.routerUrlSubscription.unsubscribe();}
		if (this.drafftNumber){this.drafftNumber.unsubscribe();}
    }

    /*user menu*/
    onToggleUserMenu() {
        this.userMenuOpened = !this.userMenuOpened;
    }
    onCloseUserMenu() {
        this.userMenuOpened = false;
    }

    /*rs menu*/
    onToggleRsMenu() {
        this.rsMenuOpened = !this.rsMenuOpened;
    }

    /*logout popup*/
    onLogoutPopupOpen() {
        this.userMenuOpened = false;
        this.logoutPopupOpened = true;
    }

    onLogout() {
        this.loaderIsVisible = true;
        if (window.localStorage.getItem('keepLoginEntandem')) {
            window.localStorage.removeItem('keepLoginEntandem');
        }
        this.logoutPopupOpened = false;
        this.Auth.logout().pipe(
            finalize(() => {
                this.loaderIsVisible = false;
            })
        )
            .subscribe((data) => {
			if (data){
				if (this.drafftNumber){this.drafftNumber.unsubscribe();}
				this.reportNumb = 0;
			}
            }, (err) => {
                if (err.error.errorCode == 3) {
                    this.snackComponent.openSnackBar(this.textErrorImpersionate);
                } else {
                    this.snackComponent.openSnackBar(this.textError);
                }
            });
    }

    onScreenHeader() {
        this.headerHovered = false;
        this.headerService.headerOpened.next(!this.headerService.headerOpened.value);
    }

}
