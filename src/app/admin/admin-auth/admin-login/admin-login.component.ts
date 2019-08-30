import {Component, Inject, LOCALE_ID, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {emailPattern} from '../../../_shared/validators/email.validator';
import {Router} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {trigger} from '@angular/animations';
import {itemAnimation} from '../../../_shared/animations';
import {AdminAuthService} from '../admin-auth.service';
import {AuthService} from '../../../_shared/services/auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  animations: [trigger('itemAnimation', itemAnimation)]
})
export class AdminLoginComponent implements OnInit {

  loginForm: FormGroup;
  loaderIsVisible = false;
  serverError = false;
  loginError = false;
  remember: boolean;
  inactiveAccount = false;
  passwordVisible = false;
  languages = [
    {'code': 'en-US', 'text': 'EN', 'url': ''},
    {'code': 'fr', 'text': 'FR', 'url': ''}
  ];
  constructor(@Inject(LOCALE_ID) public localeId: string,
              private formBuilder: FormBuilder,
              private route: Router,
              private adminAuthService: AdminAuthService,
              private authService: AuthService) { }
  ngOnInit() {
    const adminEmail = this.authService.getToken();
    adminEmail ? this.remember = true : this.remember = false;
    this.loginForm = this.formBuilder.group({
      email: [null, Validators.compose([Validators.required, Validators.pattern(emailPattern)])],
      password: [null, Validators.compose([Validators.required])],
    });
  }
  rememberMe(event) {
    this.remember = event.checked;
    if ( this.remember ) {
      this.saveAdminMail();
    } else {
      this.removeAdminMail();
    }
  }
  saveAdminMail() {
    if (this.loginForm.get('email').value && this.loginForm.get('email').valid) {
      window.localStorage.setItem('keepLoginEntandem', this.loginForm.get('email').value);
    }
  }
  removeAdminMail() {
    window.localStorage.removeItem('keepLoginEntandem');
  }
  submitForm() {
    if ( this.remember && localStorage.getItem('keepLoginEntandem') === null || this.loginForm.get('email').value !== localStorage.getItem('keepLoginEntandem') ) {
      this.saveAdminMail();
    }
    if ( this.loginForm.valid ) {
      this.loaderIsVisible = true;
      this.adminAuthService.login(this.loginForm.value)
        .pipe(
          finalize(() => {
            this.loaderIsVisible = false;
          })
        ).subscribe(
        (response) => {
        },
        (error) => {
          if (error.error.errorCode === 0) {
            this.loginError = true;
          } else if (error.error.errorCode === 2) {
            this.inactiveAccount = true;
          } else {
            this.serverError = true;
          }
        });
    }
  }
  showPassword() {
    this.passwordVisible = !this.passwordVisible;
  }

}
