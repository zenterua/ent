import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { trigger } from '@angular/animations';
import { itemAnimation } from '../../_shared/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { portalApis } from '../portal.apis';
import { map, finalize } from 'rxjs/operators';
import { AuthService } from '../../_shared/services/auth.service';
import { emailPattern } from '../../_shared/validators/email.validator';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	animations: [trigger('itemAnimation', itemAnimation)]
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;
	loaderIsVisible: boolean;
	networkError: boolean;
	errorCode: any;
	serverError: boolean;
	resetPassword: boolean;
	userError: boolean;
	expired: boolean;
	confirmEmail: boolean;
	locked: boolean;
	emailChanged: boolean;
	isHideShow: boolean = false;
	passwordVisible: boolean;

	constructor(private Auth: AuthService, private route: ActivatedRoute, private router: Router, private apis: portalApis) {
		this.route.queryParams
			.subscribe(params => {
				if (params.reset) {
					this.resetPassword = params.reset;
				}
				if (params.token) {
					this.confirmEmail = true;
					this.Auth.clearData();
					this.confirmEmailData(params.token);
				}
			});

		if (this.isHideShow) {
			this.passwordVisible = true;
		}

	}

	confirmEmailData(token) {
		this.apis.confirmChangeEmail(token)
			.pipe(
				finalize(() => {
					this.loaderIsVisible = false;
					this.confirmEmail = false;
				})
			)
			.subscribe(
				(data => {
					if (data) {
						this.confirmEmail = false;
						this.resetPassword = false;
						this.emailChanged = true;
					}
				}),
				(error => {
					if (error.error == 'token expired') {
						this.expired = true;
					} else {
						this.serverError = true;
					}
				})
			);
	}

	ngOnInit() {
		const email = window.localStorage.getItem('keepLoginEntandem');
		this.loginForm = new FormGroup({
			'email': new FormControl(null, [Validators.required, Validators.pattern(emailPattern)]),
			'password': new FormControl(null, [Validators.required]),
			'remember': new FormControl(false)
		});
	}

	rememberMe(event) {
		if (event.checked && this.loginForm.get('email').value && this.loginForm.get('email').valid) {
			window.localStorage.setItem('keepLoginEntandem', this.loginForm.get('email').value);
		} else {
			window.localStorage.removeItem('keepLoginEntandem');
		}
	}

	showPassword() {
		this.passwordVisible = !this.passwordVisible;
	}


	onSubmitForm() {
		if (this.loginForm.valid) {
			this.loaderIsVisible = true;
			this.Auth.login(this.loginForm.value)
				.pipe(finalize(() => {
					this.loaderIsVisible = false;
				}))
				.subscribe(
					(response => {
						this.serverError = false;
						this.router.navigate(['/reports/new-report']);
					}),
					(error => {
						if (error.error == 'token expired') {
							this.expired = true;
						} else {
							this.serverError = true;
						}
					})
				);
		}
	}

}