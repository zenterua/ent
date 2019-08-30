import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { trigger } from '@angular/animations';
import { itemAnimation } from '../../_shared/animations';
import { matchFieldsValidator } from '../../_shared/validators/match-fields.validator';
import { passwordPattern } from '../../_shared/validators/password.validator';
import { map, finalize } from 'rxjs/operators';
import { portalApis } from '../portal.apis';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
	selector: 'app-resetpassword',
	templateUrl: './resetpassword.component.html',
	animations: [trigger('itemAnimation', itemAnimation)]
})
export class ResetpasswordComponent implements OnInit {
	resetForm: FormGroup;
	resetSuccess: boolean;
	serverError: boolean;
	loaderIsVisible: boolean;
	tokenParams: any;
	expired: boolean;

	constructor(private apis: portalApis, private router: Router, private route: ActivatedRoute) {
		this.resetForm = new FormGroup({
			'password': new FormControl(null, [Validators.required, Validators.pattern(passwordPattern)]),
			'passwordRepeat': new FormControl(null, Validators.required)
		}, matchFieldsValidator('password', 'passwordRepeat'));

		this.route.queryParams
        .subscribe(params => {
            if (params.token) {
                this.tokenParams = params.token;
            }
        })
	}

	ngOnInit() {
       this.apis.checkToken(this.tokenParams)
        .subscribe((data) => {
           if (data === true){
                this.serverError = false;
           }else{
                this.resetSuccess = true;
                if (data.error === 'token expired') {
                    this.expired = true;
                    this.serverError = false;
                } else {
                    this.serverError = true;
                    this.expired = false;
                }
           }
        }, (err) => {
            this.serverError = true;
            this.expired = false;
        })
        
    }

	onSubmitForm() {
		this.loaderIsVisible = true;
		this.serverError = false;
		if (this.resetForm.valid) {
			this.apis.resetPassword(this.resetForm.value, this.tokenParams)
				.pipe(
					finalize(() => {
						this.loaderIsVisible = false;
					})
				)
				.subscribe((data) => {
					if (!data.error && this.tokenParams) {
						this.router.navigate(['/auth/login'], { queryParams: { reset: 'true' } });
					} else {
						this.resetSuccess = true;
						if (data.error === 'token expired') {
							this.expired = true;
							this.serverError = false;
						} else {
							this.serverError = true;
							this.expired = false;
						}
					}
				}, (err) => {
					this.resetSuccess = true;
					this.serverError = true;
					this.expired = false;
				})
		}
	}

}
