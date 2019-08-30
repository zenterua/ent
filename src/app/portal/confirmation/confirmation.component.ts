import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';
import { trigger } from '@angular/animations';
import { itemAnimation } from '../../_shared/animations';
import { map, finalize } from 'rxjs/operators';
import { portalApis } from '../portal.apis';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-confirmation',
	templateUrl: './confirmation.component.html',
	animations: [trigger('itemAnimation', itemAnimation)]
})
export class ConfirmationComponent implements OnInit {
	loaderIsVisible: boolean;
	tokenParams: string;
	confirmed: boolean;
	expired: boolean;
	serverError: boolean;
	linkResend: boolean;
	azureId: any;

	constructor(private apis: portalApis, private route: ActivatedRoute, @Inject(LOCALE_ID) public localeId: string) {
		this.route.queryParams
			.subscribe(params => {
				if (params.token) {
					this.tokenParams = params.token;
				}
			})
	}

	ngOnInit() {
		this.confirmAccount(this.tokenParams);
	}

	confirmAccount(token) {
		this.loaderIsVisible = true;
		if (token) {
			this.apis.registrationConfirm(token)
				.pipe(
					finalize(() => {
						this.loaderIsVisible = false;
					})
				)
				.subscribe((data) => {
					if (data === true) {
						this.confirmed = true;
					} else {
						this.confirmed = false;
						if (data.error == 'token expired') {
							this.expired = true;
							this.azureId = data.AZURE_ID;
						} else {
							this.serverError = true;
						}
					}
				}, (error) => {
					this.expired = false;
					this.confirmed = false;
					this.serverError = true;
				})
		}
	}

	resendLink() {
		this.loaderIsVisible = true;
		this.apis.resendRegistrationConfirm(this.azureId, this.localeId == 'fr' ? 'F' : '')
			.pipe(
				finalize(() => {
					this.loaderIsVisible = false;
				})
			)
			.subscribe((data) => {
				if (data) {
					this.linkResend = true;
					this.expired = false;
				}
			}, (err) => {
				this.linkResend = false;
				this.expired = false;
				this.serverError = true;
			});
	}


}
