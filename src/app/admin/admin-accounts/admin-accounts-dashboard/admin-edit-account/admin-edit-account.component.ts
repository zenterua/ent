import {Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdminAccountsService} from '../../admin.accounts.service';
import {finalize} from 'rxjs/operators';
import {Admin} from '../../../admin-shared/admin.interfaces';
import {SnackBarComponent} from '../../../../_shared/components/snack-bar/snack-bar.component';

@Component({
  selector: 'app-admin-edit-account',
  templateUrl: './admin-edit-account.component.html'
})
export class AdminEditAccountComponent implements OnInit {
  editAdmin: FormGroup;
  loaderIsVisible = false;
  submitAccountSnack: string;
  submitAccountErrorSnack: string;
  @ViewChild(SnackBarComponent) snackComponent: SnackBarComponent;
  @Output() editEmitter = new EventEmitter<any>();
  @Input() currentAdmin: Admin;
  constructor(private formBuilder: FormBuilder,
              private adminAccountsService: AdminAccountsService,
              @Inject(LOCALE_ID) protected localeId: string) { }
  ngOnInit() {
    if ( this.localeId === 'en-US' ) {
      this.submitAccountSnack = 'Account Successfully Changed';
      this.submitAccountErrorSnack = 'Account Change Unsuccessful';
    } else {
      this.submitAccountSnack = 'Le compte a été modifié avec succès !';
      this.submitAccountErrorSnack = 'Une erreur s’est produite';
    }
    this.editAdmin = this.formBuilder.group({
      firstName: [null, Validators.compose([Validators.required])],
      lastName: [null, Validators.compose([Validators.required])]
    });
    this.editAdmin.get('firstName').setValue(this.currentAdmin.FIRST_NAME);
    this.editAdmin.get('lastName').setValue(this.currentAdmin.LAST_NAME);
  }
  submitEditAccount() {
    const submitAccountSnack = this.submitAccountSnack;
    const submitAccountErrorSnack = this.submitAccountErrorSnack
    const accInfo = {
      id: this.currentAdmin.AZURE_ID,
      firstName: this.editAdmin.value.firstName,
      lastName: this.editAdmin.value.lastName
    };
    if ( this.editAdmin.valid ) {
      this.loaderIsVisible = true;
      this.adminAccountsService.editAccount(accInfo).pipe(
        finalize(() => {
          this.loaderIsVisible = false;
        }),
      ).subscribe((response: any) => {
        if ( response ) {
          this.editEmitter.emit({response, submitAccountSnack, submitAccountErrorSnack});
        } else {
          this.snackComponent.openSnackBar(this.submitAccountErrorSnack);
        }
      }, () => {
        this.snackComponent.openSnackBar(this.submitAccountErrorSnack);
      });
    }
  }

}
