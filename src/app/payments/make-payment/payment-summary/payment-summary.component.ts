import { Component, OnInit, ViewChild, LOCALE_ID, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { trigger } from '@angular/animations';
import { itemAnimation } from '../../../_shared/animations';
import { SnackBarComponent } from '../../../_shared/components/snack-bar/snack-bar.component';
import { MakePaymentService } from '../make.payment.service';

@Component({
	selector: 'app-payment-summary',
	templateUrl: './payment-summary.component.html',
	animations: [trigger('itemAnimation', itemAnimation)]
})
export class PaymentSummaryComponent implements OnInit {
	payStatusUnsuccess: boolean;
	payStatusSuccess: boolean;
	loaderIsVisible: boolean;
	serverError: boolean;
	paymentData: any = {};
	receiptForm: FormGroup;
	paymentId: any;
	payAmount: any;
	contacts: any[] = [];
	sendContacts: any[] = [];
	primaryContact: string;
	isLoading: boolean;
	@ViewChild('formCopy') formCopy;
	@ViewChild(SnackBarComponent) snackComponent: SnackBarComponent;

	constructor(private route: ActivatedRoute, private makePaymentService: MakePaymentService, @Inject(LOCALE_ID) public localeId: string) {
		this.receiptForm = new FormGroup({
			'copyToMe': new FormControl(false, Validators.pattern('true')),
			'copyToOther': new FormControl(false, Validators.pattern('true')),
			'licensingContacts': new FormControl(null)
		});
	}

	ngOnInit() {
		this.route.params.subscribe(params => {
			if (params.id) {
				this.paymentId = params.id;
				this.getPaymentDetail(params.id);
			}
			this.loaderIsVisible = true;
		});
	}

	getContacts() {
		this.makePaymentService.getContacts().subscribe((data) => {
			if (data) {
				this.getPrimaryContact(data);
			}
		});
	}


	getPrimaryContact(contacts) {
		contacts.forEach((data) => {
			if (data.PRIMARY_CONTACT == 'Y') {
				this.primaryContact = data.E_MAIL;
			} else {
				this.contacts.push(data);
			}
		})
	}

	sendCopy() {
		let emailArr = [];
		let primaryArr = [this.primaryContact];
		if (this.receiptForm.get('copyToMe').value && this.receiptForm.get('copyToOther').value) {
			emailArr = [...primaryArr, ...this.receiptForm.get('licensingContacts').value];
		} else if (this.receiptForm.get('copyToOther').value) {
			emailArr = [...this.receiptForm.get('licensingContacts').value];
		} else if (this.receiptForm.get('copyToMe').value) {
			emailArr = [...primaryArr];
		} else {
			emailArr = [];
		}
		let sendEmailsArr = {
			id: this.paymentData.AUTHORIZATION_NO,
			emails: emailArr
		};
		this.isLoading = true;
		this.makePaymentService
			.sendPayment(sendEmailsArr, this.localeId == 'fr' ? 'F' : '')
			.subscribe((data) => {
				if (data) {
					this.snackComponent.openSnackBar('Copy was sent to selected email addresses');
					this.formCopy.resetForm();
				} else {
					this.serverError = true;
				}
				this.isLoading = false;
			}, (error) => {
				this.isLoading = false;
				this.serverError = true;
			});
	}

	isSendCopy() {
		if (this.receiptForm.get('copyToMe').value || (this.receiptForm.get('copyToOther').value && this.receiptForm.get('licensingContacts').value && this.receiptForm.get('licensingContacts').value.length)) {
			return true;
		} else {
			return false;
		}
	}

	getPaymentDetail(id) {
		this.loaderIsVisible = true;
		this.makePaymentService.getPayment(id)
			.pipe(finalize(() => {
				this.loaderIsVisible = false;
				this.getContacts();
			}))
			.subscribe((data) => {
				if (data) {
					this.paymentData = data;
					this.payAmount = data.PAYMENT_AMT.toFixed(2);
					if (data.PAYMENT_STATUS == 1) {
						this.payStatusSuccess = true;
						this.payStatusUnsuccess = false;
					} else {
						this.payStatusSuccess = false;
						this.payStatusUnsuccess = true;
					}
				} else {
					this.serverError = true;
				}
			}, (error) => {
				this.serverError = true;
			});
	}

}
