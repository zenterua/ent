import {Component, Inject, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {SnackBarComponent} from '../../../_shared/components/snack-bar/snack-bar.component';
import {AdminAccountsService} from '../admin.accounts.service';
import {finalize} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {Admin} from '../../admin-shared/admin.interfaces';
import {concat} from 'rxjs';
import {trigger} from '@angular/animations';
import {animationPopup, itemAnimation} from '../../../_shared/animations';
import {AdminShareService} from '../../admin-shared/admin.share.service';

@Component({
  selector: 'app-admin-account-detail',
  templateUrl: './admin-account-detail.component.html',
  animations: [trigger('itemAnimation', itemAnimation), trigger('animationPopup', animationPopup)]
  })
  export class AdminAccountDetailComponent implements OnInit {
  adminActived = false;
  adminInactived = false;
  loaderIsVisible = false;
  confirmDeletePopup = false;
  showAdminError = false;
  showAdminInfo = false;
  adminData: Admin;
  deleteAccountSnack: string;
  deleteAccountErrorSnack: string;
  toggleStatusSnack: string;
  toggleStatusErrorSnack: string;
  @ViewChild(SnackBarComponent) snackComponent: SnackBarComponent;
  constructor(private adminAccountsService: AdminAccountsService,
              private activateRoute: ActivatedRoute,
              private route: Router,
              @Inject(LOCALE_ID) protected localeId: string,
              private adminShareService: AdminShareService) {
  }
  ngOnInit() {
    if ( this.localeId === 'en-US' ) {
      this.deleteAccountSnack = 'Account Successfully Deleted';
      this.deleteAccountErrorSnack =  'Account Deletion Unsuccessful';
      this.toggleStatusSnack = 'Account Status Successfully Changed';
      this.toggleStatusErrorSnack =  'Account Status Change Unsuccessful';
    } else {
      this.deleteAccountSnack = 'Le compte a été supprimé avec succès';
      this.deleteAccountErrorSnack =  'Une erreur s’est produite';
      this.toggleStatusSnack = 'Le statut du compte a été modifié avec succès !';
      this.toggleStatusErrorSnack =  'Une erreur s’est produite';
    }
    this.loaderIsVisible = true;
    const adminId = this.activateRoute.snapshot.params.id;
    this.adminAccountsService.getAdminInfo(adminId).pipe(
      finalize(() => {
        this.loaderIsVisible = false;
      })
    ).subscribe((response: Admin) => {
      if ( response ) {
        this.adminData = response;
        this.adminActived = false;
        this.adminInactived = false;
        this.showAdminInfo = true;
        this.showAdminError = false;
        response.ACTIVE === 1 ? this.adminActived = true : this.adminInactived = true;
      }
    });
  }
  toggleStatus() {
    this.loaderIsVisible = true;
    const adminId = this.activateRoute.snapshot.params.id;
    const arrayOfAdmins = {id: this.adminData.AZURE_ID, status: this.adminData.ACTIVE === 1 ? 0 : 1};
    this.loaderIsVisible = true;
    concat(
      this.adminAccountsService.chageAccountStatus(arrayOfAdmins),
      this.adminAccountsService.getAdminInfo(adminId)
    ).pipe(
      finalize(() => {
        this.loaderIsVisible = false;
      })
    ).subscribe((response: any) => {
      if ( response.ACCT_NO ) {
        this.adminActived = false;
        this.adminInactived = false;
        response.ACTIVE === 1 ? this.adminActived = true : this.adminInactived = true;
        this.adminData = response;
        this.snackComponent.openSnackBar(this.toggleStatusSnack);
      }
    }, () => {
      this.snackComponent.openSnackBar(this.toggleStatusErrorSnack);
    });
  }
  deleteAdminAccount() {
    this.loaderIsVisible = true;
    const arrayOfAdmins = {id: this.adminData.AZURE_ID};
    this.loaderIsVisible = true;
    this.adminAccountsService.removeAccout(arrayOfAdmins).pipe(
      finalize(() => {
        this.loaderIsVisible = false;
      }),
    ).subscribe((response: any) => {
      if ( response ) {
        this.snackComponent.openSnackBar(this.deleteAccountSnack);
        this.route.navigate(['/admin/accounts/']);
      }
    }, () => {
      this.snackComponent.openSnackBar(this.deleteAccountErrorSnack);
    });
  }
  setDate(date: any) {
    return this.adminShareService.setDate(date);
  }
}
