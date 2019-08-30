import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MakePaymentService } from '../make-payment/make.payment.service';
import { UserDataService } from '../../header/user.data.service';
import { finalize } from 'rxjs/operators';
import { formatDate } from '@angular/common';

@Component({
	selector: 'app-payment-detail',
	templateUrl: './payment-detail.component.html'
})
export class PaymentDetailComponent implements OnInit {
	payStatusUnsuccess: boolean;
	payStatusSuccess: boolean;
	loaderIsVisible: boolean;
	serverError: boolean;
	paymentPrint: boolean;
	paymentData: any = {};
	paymentId: any;
	payAmount: any;
	userData: any = {};

	constructor(private route: ActivatedRoute, private makePaymentService: MakePaymentService, private userDataService: UserDataService) { }

	ngOnInit() {
		this.getLicenseeData();
		this.route.params.subscribe(params => {
			if (params.id) {
				this.paymentId = params.id;
				this.getPaymentDetail(params.id);
			}

			this.loaderIsVisible = true;
		});

		this.route.queryParams.subscribe(params => {
			if (params.print && params.print == this.paymentId) {
				this.paymentPrint = true;
			} else {
				this.paymentPrint = false;
			}
		});
	}

	getLicenseeData() {
		this.userDataService.currentData
			.subscribe((value) => {
				this.userData = value;
			});
	}

	getPaymentDetail(id) {
		this.loaderIsVisible = true;
		this.makePaymentService.getPayment(id)
			.pipe(finalize(() => {
				this.loaderIsVisible = false;
				if (this.paymentPrint) {
					setTimeout(() => {
						window.print();
						this.paymentPrint = false;
					}, 2000);
				};
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

	setTime(time: any) {
		let s = time.split(' ').join('T');
		let t = new Date(s);
		return formatDate(t, 'MMM d, yyyy h:mm a', 'en-US')
	}

}
