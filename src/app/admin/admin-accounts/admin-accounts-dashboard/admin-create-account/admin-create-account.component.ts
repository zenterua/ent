import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {emailPattern} from '../../../../_shared/validators/email.validator';
import {AdminAccountsService} from '../../admin.accounts.service';
import {finalize} from 'rxjs/operators';
import {SnackBarComponent} from '../../../../_shared/components/snack-bar/snack-bar.component';

@Component({
  selector: 'app-admin-create-account',
  templateUrl: './admin-create-account.component.html'
})
export class AdminCreateAccountComponent implements OnInit {
  newAdmin: FormGroup;
  loaderIsVisible = false;
  @ViewChild('newAdminForm') newAdminForm;
  @ViewChild(SnackBarComponent) snackComponent: SnackBarComponent;
  @Output() createAdmin = new EventEmitter<object>();
  constructor(private formBuilder: FormBuilder, private adminAccountsService: AdminAccountsService) { }

  ngOnInit() {
    this.newAdmin = this.formBuilder.group({
      firstName: [null, Validators.compose([Validators.required])],
      lastName: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required, Validators.pattern(emailPattern)])],
    });
  }
  createNewAdmin(snackMessage: string, snackErrorMessage: string) {
    if (this.newAdmin.invalid) { return false; }
    this.loaderIsVisible = true;
    this.adminAccountsService.createAccount(this.newAdmin.value).pipe(
      finalize(() => {
        this.loaderIsVisible = false;
      })
    ).subscribe((response: string) => {
      if ( response ) {
        this.createAdmin.emit({response, snackMessage, snackErrorMessage});
        this.newAdminForm.resetForm();
      }
    }, () => {
      this.snackComponent.openSnackBar(snackErrorMessage);
    });
  }

}
