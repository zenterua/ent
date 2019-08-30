import {Component, Inject, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {SnackBarComponent} from '../../../_shared/components/snack-bar/snack-bar.component';
import {AdminUserManagementService} from '../admin.user.management.service';
import {finalize} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {Admin, Contact} from '../../admin-shared/admin.interfaces';
import {itemAnimation} from '../../../_shared/animations';
import {trigger} from '@angular/animations';
import {concat} from 'rxjs';
import {AdminShareService} from '../../admin-shared/admin.share.service';

@Component({
  selector: 'app-admin-user-detail',
  templateUrl: './admin-user-detail.component.html',
  animations: [trigger('itemAnimation', itemAnimation)]
  })
export class AdminUserDetailComponent implements OnInit {
  loaderIsVisible = false;
  showUserInfo = false;
  showUserError = false;
  userActived = false;
  userInactived = false;
  userInfo: Admin;
  userContact: Contact;
  toggleStatusSnack: string;
  toggleStatusErrorSnack: string;
  resetPasswordSnack: string;
  resetPasswordErrorSnack: string;
  @ViewChild(SnackBarComponent) snackComponent: SnackBarComponent;
  constructor(private adminManagmentService: AdminUserManagementService,
              private activatedRoute: ActivatedRoute,
              @Inject(LOCALE_ID) protected localeId: string,
              private adminShareService: AdminShareService) {}
  ngOnInit() {
    if ( this.localeId === 'en-US' ) {
      this.toggleStatusSnack = 'Account Status Successfully Changed';
      this.resetPasswordSnack = 'New Password Sent';
      this.toggleStatusErrorSnack = 'Account Status Change Unsuccessful';
      this.resetPasswordErrorSnack = 'Password delivery failure';
    } else {
      this.toggleStatusSnack = 'Le statut du compte a été modifié avec succès !';
      this.resetPasswordSnack = 'Envoi de la nouveau mot de passe réussi.';
      this.toggleStatusErrorSnack = 'Une erreur s’est produite';
      this.resetPasswordErrorSnack = 'Une erreur s’est produite';
    }
    this.loaderIsVisible = true;
    const userId = this.activatedRoute.snapshot.params.id;
    this.adminManagmentService.getUserInfo(userId).pipe(
      finalize(() => {
        this.loaderIsVisible = false;
      })
    ).subscribe((response: any) => {
      if ( response) {
        this.userInfo = response.user;
        this.userContact = response.contact;
        this.userInfo.ACTIVE === 1 ? this.userActived = true : this.userInactived = true;
        this.showUserInfo = true;
        this.showUserError = false;
      } else {
        this.showUserInfo = false;
        this.showUserError = true;
      }
    }, () => {
      this.showUserInfo = false;
      this.showUserError = true;
    });
  }
  toggleStatus() {
    const userId = this.activatedRoute.snapshot.params.id;
    const arrayOfAdmins = {id: this.userInfo.AZURE_ID, status: this.userInfo.ACTIVE === 1 ? 0 : 1};
    this.loaderIsVisible = true;
    concat(
      this.adminManagmentService.chageAccountStatus(arrayOfAdmins),
      this.adminManagmentService.getUserInfo(userId)
    ).pipe(
      finalize(() => {
        this.loaderIsVisible = false;
      })
    ).subscribe((response: any) => {
      if ( response.user ) {
        this.userInfo.ACTIVE = response.user.ACTIVE;
        if ( this.userInfo.ACTIVE === 1 ) {
          this.userActived = true;
          this.userInactived = false;
        } else if ( this.userInfo.ACTIVE === 0 ) {
          this.userInactived = true;
          this.userActived = false;
        }
        this.snackComponent.openSnackBar(this.toggleStatusSnack);
      }
    }, () => {
      this.snackComponent.openSnackBar(this.toggleStatusErrorSnack);
    });
  }
  resetPassword() {
    this.loaderIsVisible = true;
    this.adminManagmentService.resetUserPassword(this.userInfo.AZURE_ID).pipe(
      finalize(() => {
        this.loaderIsVisible = false;
      })
    ).subscribe((response) => {
      if ( response ) {
        this.snackComponent.openSnackBar(this.resetPasswordSnack);
      } else {
        this.snackComponent.openSnackBar(this.resetPasswordErrorSnack);
      }
    }, (error) => {
      this.snackComponent.openSnackBar(this.resetPasswordErrorSnack);
    });
  }
  setDate(date: any) {
    return this.adminShareService.setDate(date);
  }
}
