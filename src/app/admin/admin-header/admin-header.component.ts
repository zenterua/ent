import {Component, OnInit, ViewEncapsulation, HostListener, ViewChild, Inject, LOCALE_ID} from '@angular/core';
import {Router} from '@angular/router';
import { trigger } from '@angular/animations';
import {finalize} from 'rxjs/operators';
import { animationPopup, animationHeader } from '../../_shared/animations';
import { HeaderService } from '../../header/header.service';
import {SnackBarComponent} from '../../_shared/components/snack-bar/snack-bar.component';
import {AdminHeaderService} from './admin.header.service';
import {AdminShareService} from '../admin-shared/admin.share.service';
import {AdminMeService} from '../admin-shared/admin.me.service';
import { RouterUrlService } from 'src/app/_shared/services/router.url.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('animationHeader', animationHeader),
    trigger('animationPopup', animationPopup)
  ]
})
export class AdminHeaderComponent implements OnInit {
  rsMenuOpened: boolean;
  logoutPopupOpened: boolean;
  headerHovered: boolean;
  scrolled: boolean;
  userName: string;
  adminId: any;
  loaderIsVisible: boolean;
  superAdmin = false;
  frenchPopupOpened = false;
  routerCallbackSubscription: Subscription;
  languages = [
      {'code': 'en-US', 'text': 'EN', 'url': ''},
      {'code': 'fr', 'text': 'FR', 'url': ''}
  ];
  @ViewChild(SnackBarComponent) snackComponent: SnackBarComponent;
  @HostListener('window:scroll', ['$event']) handleScroll() {
    this.onScrollHeader();
  }
  constructor(
    private headerService: HeaderService,
    private route: Router,
    private adminHeaderService: AdminHeaderService,
    private adminMe: AdminMeService,
    private adminShareService: AdminShareService,
    private routerUrlService: RouterUrlService,
    @Inject(LOCALE_ID) public localeId: string) {
      this.loaderIsVisible = true;
    }
  ngOnInit() {
    this.routerCallbackSubscription = this.routerUrlService.routerCallback.subscribe((value) => {
      this.languages[0].url = window.location.href.replace('/fr/', '/en/');
      this.languages[1].url = window.location.href.replace('/en/', '/fr/');
  });
    this.adminMe.aboutMe().pipe(
      finalize(() => {
        this.loaderIsVisible = false;
      })
    ).subscribe(() => {
	  this.adminId = `${this.adminMe.adminInfo.ACCT_NO}`;
      this.userName = `${this.adminMe.adminInfo.FIRST_NAME[0]} ${this.adminMe.adminInfo.LAST_NAME[0]}`;
      this.adminMe.adminInfo.ROLE === 3 ? this.superAdmin = true : this.superAdmin = false;
    }, (error) => {
      this.snackComponent.openSnackBar('Server Error');
    });
  }
  onScrollHeader() {
     const windowScroll = window.pageYOffset;
     windowScroll > 120 ? this.scrolled = true : this.scrolled = false;
  }
  onToggleRsMenu() {
    this.rsMenuOpened = !this.rsMenuOpened;
  }
  onLogout(snackErrorMessage) {
    this.loaderIsVisible = true;
    this.logoutPopupOpened = false;
    this.adminHeaderService.logOut().pipe(
        finalize(() => {
          this.loaderIsVisible = false;
        })
      )
      .subscribe((response) => {
        if (!response) {
          this.snackComponent.openSnackBar(snackErrorMessage);
        }
      });
  }
  // onMouseEnterHeader() {
  //   this.headerHovered = true;
  // }
  // onMouseLeaveHeader() {
  //   this.headerHovered = false;
  // }

  onScreenHeader() {
    this.headerHovered = false;
    this.headerService.headerOpened.next(!this.headerService.headerOpened.value);
  }
  routToAdminAccounts() {
    this.route.navigate(['/admin/accounts']);
  }
  resetMyPassword(snackMessage: string, snackErrorMessage: string) {
    this.loaderIsVisible = true;
    this.adminShareService.resetPassword().pipe(
      finalize(() => {
        this.loaderIsVisible = false;
      })
    ).subscribe(() => {
      this.snackComponent.openSnackBar(snackMessage);
    }, (error: {error: string}) => {
      if ( error.error ) {
        this.snackComponent.openSnackBar(snackErrorMessage);
      }
    });
  }

}
