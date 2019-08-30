import {Component, Inject, LOCALE_ID, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {trigger} from '@angular/animations';
import {finalize} from 'rxjs/operators';
import {emailPattern} from '../../../_shared/validators/email.validator';
import {itemAnimation} from '../../../_shared/animations';
import {AdminAuthService} from '../admin-auth.service';

@Component({
  selector: 'app-admin-forgot-password',
  templateUrl: './admin-forgot-password.component.html',
  animations: [trigger('itemAnimation', itemAnimation )]
})
export class AdminForgotPasswordComponent implements OnInit {

  forgotForm: FormGroup;
  resetSuccessful = false;
  loaderIsVisible = false;
  resetError = false;
  languages = [
    {'code': 'en-US', 'text': 'EN', 'url': ''},
    {'code': 'fr', 'text': 'FR', 'url': ''}
  ];
  constructor(private formBuilder: FormBuilder,
              private adminAuthService: AdminAuthService,
              @Inject(LOCALE_ID) public localeId: string) { }
  ngOnInit() {
    this.forgotForm = this.formBuilder.group({
      email: [null, Validators.compose([Validators.required, Validators.pattern(emailPattern)])]
    });
  }
  submitForm() {
    this.loaderIsVisible = true;
    if ( this.forgotForm.valid ) {
      this.adminAuthService.forgotPassword(this.forgotForm.value, this.localeId === 'fr' ? 'F' : '').pipe(
        finalize(() => {
          this.loaderIsVisible = false;
        })
      ).subscribe(
        (response) => {
          this.resetSuccessful = true;
          this.resetError = false;
        },
        (error) => {
          this.resetSuccessful = false;
          this.resetError = true;
        });
    }
  }

}
