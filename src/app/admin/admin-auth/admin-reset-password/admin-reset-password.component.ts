import {Component, Inject, LOCALE_ID, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {matchFieldsValidator} from '../../../_shared/validators/match-fields.validator';
import {itemAnimation} from '../../../_shared/animations';
import {trigger} from '@angular/animations';
import {passwordPattern} from '../../../_shared/validators/password.validator';
import {AdminAuthService} from '../admin-auth.service';

@Component({
  selector: 'app-admin-reset-password',
  templateUrl: './admin-reset-password.component.html',
  animations: [trigger('itemAnimation', itemAnimation)]
})
export class AdminResetPasswordComponent implements OnInit {

  resetForm: FormGroup;
  resetSuccess: boolean;
  serverError: boolean;
  loaderIsVisible: boolean;
  tokenParams: any;
  expired: boolean;
  languages = [
    {'code': 'en-US', 'text': 'EN', 'url': ''},
    {'code': 'fr', 'text': 'FR', 'url': ''}
  ];
  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private adminAuthService: AdminAuthService,
              @Inject(LOCALE_ID) public localeId: string) {
  }
  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      password: [null, Validators.compose([Validators.required, Validators.pattern(passwordPattern)])],
      passwordRepeat: [null, Validators.compose([Validators.required])],
    }, { validator: Validators.compose([matchFieldsValidator('password', 'passwordRepeat')])});
    this.route.queryParams.subscribe(params => {
      if (params.token) {
        this.tokenParams = params.token;
      }
    });
    this.resetForm.valueChanges.subscribe(() => {
    });
  }
  onSubmitForm() {
    this.loaderIsVisible = true;
    this.serverError = false;
    if (this.resetForm.valid) {
      this.adminAuthService.resetPassword(this.resetForm.value, this.tokenParams)
        .pipe(
          finalize(() => {
            this.loaderIsVisible = false;
          })
        )
        .subscribe((response) => {
          if (response && this.tokenParams) {
            this.resetSuccess = true;
          }
          /*else if (response.error) {
            this.expired = true;
          } else {
            this.serverError = true;
          }*/
        }, (err) => {
          this.serverError = true;
        });
    }
  }
}
