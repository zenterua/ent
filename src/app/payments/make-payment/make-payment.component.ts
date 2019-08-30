import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { trigger } from '@angular/animations';
import { slideUpDown, itemAnimation } from '../../_shared/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { MakePaymentService } from './make.payment.service';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { payAmountValidator } from '../../_shared/validators/pay-amount.validator';
import { floatNumberPattern } from '../../_shared/validators/float-number.validator';
import { dateCardValidator } from '../../_shared/validators/month.validator';
import { LicensessService } from '../../header/licensee.service';

@Component({
	selector: 'app-make-payment',
	templateUrl: './make-payment.component.html',
	animations: [
		trigger('itemAnimation', itemAnimation)
	]
})
export class MakePaymentComponent implements OnInit, OnDestroy {
	userData: any = {};
	tab: any = 1;
	expired: any;
	paymentForm: FormGroup;
	cardExipredSubscription: Subscription;
	serverError: boolean;
	loaderIsVisible: boolean;
	monthValidation: boolean;
	maxAmount: boolean;
	impersionateModeError: boolean;

	isMaster: boolean;
	isVisa: boolean;
	isAmex: boolean;
	isDiscover: boolean;
	cardTypeSubscription: Subscription;
	codeName: string = 'CVV/CVC';
	paramsAmount: any;
	@ViewChild('amountField') inputEl: ElementRef;

	constructor(private router: Router, private makePaymentService: MakePaymentService, private route: ActivatedRoute, private licensessService: LicensessService) {
		this.paymentForm = new FormGroup({
			'total': new FormControl(null, [Validators.required, Validators.pattern(floatNumberPattern), payAmountValidator]),
			'cardnum': new FormControl(null, [Validators.required]),
			'carddate': new FormControl(null, [Validators.required, Validators.minLength(5), dateCardValidator]),
			'cardcode': new FormControl(null, [Validators.required, Validators.maxLength(3), Validators.minLength(3)])
		});
	}

	ngOnInit() {
		this.getLicenseeData();
		this.route.queryParams
			.subscribe(params => {
				if (params && params.amount) {
					this.paramsAmount = params.amount;
				}
			});
		this.cardExipredSubscription = this.paymentForm.get('carddate').valueChanges.subscribe(value => {
			let date = value;
			let mm = date.substring(0, 2);
			let yy = date.substring(3, 5);
			this.expired = yy + mm;
		});
		this.cardTypeSubscription = this.paymentForm.get('cardnum').valueChanges.subscribe(value => {
			if (/^(?:4[0-9]{12}(?:[0-9]{3})?)$/g.test(value)) {
				this.isVisa = true;
				this.codeName = 'CVV';
			} else {
				this.isVisa = false;
			}
			if (/^(?:5[1-5][0-9]{14})$/g.test(value)) {
				this.isMaster = true;
				this.codeName = 'CVC';
			} else {
				this.isMaster = false;
			}
			if (/^(?:3[47][0-9]{13})$/g.test(value)) {
				this.isAmex = true;
				this.codeName = 'CVV/CVC';
			} else {
				this.isAmex = false;
			}
			if (/^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/g.test(value)) {
				this.isDiscover = true;
				this.codeName = 'CVV/CVC';
			} else {
				this.isDiscover = false;

			}
		});

	}

	getLicenseeData() {
		this.licensessService.getInfo().subscribe((data) => {
			if (data) {
				this.userData = data;
				if (this.paramsAmount) {
					this.paymentForm.get('total').setValue(this.paramsAmount);
					this.paymentForm.get('total').updateValueAndValidity();
					setTimeout(() => { this.inputEl.nativeElement.focus() }, 0);
					setTimeout(() => { this.inputEl.nativeElement.blur() }, 100);
				} else {
					this.paymentForm.get('total').setValue(this.userData.BALANCE);
					this.paymentForm.get('total').updateValueAndValidity();
					setTimeout(() => { this.inputEl.nativeElement.focus() }, 0);
					setTimeout(() => { this.inputEl.nativeElement.blur() }, 100);
				}
			}
		});
	}

	ngOnDestroy() {
		if (this.cardExipredSubscription) { this.cardExipredSubscription.unsubscribe(); }
		if (this.cardTypeSubscription) this.cardTypeSubscription.unsubscribe();
	}

	onSubmitPaymentForm() {
		let payData = {
			total: +this.paymentForm.get('total').value,
			cardnum: this.paymentForm.get('cardnum').value,
			carddate: this.expired,
			cardcode: this.paymentForm.get('cardcode').value,
		};

		this.loaderIsVisible = true;

		if (this.paymentForm.valid && +this.paymentForm.get('total').value <= 10000) {
			this.maxAmount = false;
			this.makePaymentService.pay(payData)
				.pipe(finalize(() => {
					this.loaderIsVisible = false;
				}))
				.subscribe((data) => {
					if (data) {
						this.router.navigate(['/payments/payment-summary/', data.AUTHORIZATION_NO]);
					} else {
						this.serverError = true;
					}
				}, (error) => {
					this.serverError = true;
					if (error.error.errorCode == 3) {
						this.impersionateModeError = true;
					}
				});
		} else {
			this.maxAmount = true;
			this.loaderIsVisible = false;
		}
	}

	isSet(tabNum) {
		return this.tab === tabNum;
	}

	setTab(newTab) {
		this.tab = newTab;
	}

}
