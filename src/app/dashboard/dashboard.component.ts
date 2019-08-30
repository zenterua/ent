import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  LOCALE_ID,
  Inject,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { formatDate } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UserDataService } from '../header/user.data.service';
import { AuthService } from '../_shared/services/auth.service';
import { ReportApiServices } from '../reports/report.api.services';
import { PaymentHistoryService } from '../payments/payment-history/payment.history.service';
import { InvoiceService } from '../invoices/invoice.service';
import { DashboardService } from './dashboard.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
	paymentsList = new MatTableDataSource();
	displayedColumns: string[] = ['date', 'time', 'id', 'name', 'type', 'total', 'status'];
	reportList = new MatTableDataSource();
	displayedColumnsReports: string[] = ['draft', 'name', 'musicUsage', 'total', 'date'];
	loaderIsVisible: boolean;
	lastInvoice: any;
	userData: any;
	reminders: any[];

	userSub: Subscription;
	tableLength: any;
	tableLengthRepo: any;
	tableLengthInv: any;
	nothingFound: boolean;
	loaderIsVisibleInv: boolean;
	loaderIsVisibleDraf: boolean;
	loaderIsVisiblePay: boolean;

	transform: any = '0';
	count: number = 1;
	@ViewChild('wrapper') wrapper: ElementRef;
	leftDisabled: boolean = true;
	rightDisabled: boolean;
  sliderBtnDisable = false;

	constructor(private auth: AuthService, private userDataService: UserDataService, private paymentHistoryService: PaymentHistoryService, private reportApiServices: ReportApiServices, private dashboardService: DashboardService, @Inject(LOCALE_ID) public localeId: string, private invoiceService: InvoiceService) {

	}

	ngOnInit() {
		this.userSub = this.userDataService.currentData
			.subscribe((value) => {
				if (value.USER_ID) {
					this.userData = value;;
				}
			});
		this.getReminders();
		this.getPayments();
		this.getInvoice();
		setTimeout(() => { this.getDraffts(); }, 0);
	}

	ngOnDestroy() {
		if (this.userSub) { this.userSub.unsubscribe(); }
	}

	slideNext() {
		this.leftDisabled = false;
		if (this.count < this.wrapper.nativeElement.childNodes.length - 1) {
			this.count++;
      this.transform = 100 * (this.count === 1 ? 1 : this.count) - 100;
      if ((this.count + 1) == this.wrapper.nativeElement.childNodes.length) {
				this.rightDisabled = true;
			}
		}
	}

	slidePrev() {
		this.rightDisabled = false;
		if (this.count > 1) {
			this.count--;
      this.transform = 100 * (this.count === 1 ? 0 : this.count === 2 ? 1 : this.count);
			if (this.count == 1) {
				this.leftDisabled = true;
			}
		}
	}

	getReminders() {
		this.dashboardService.getReminders()
			.subscribe((response: any) => {
				if (response.content.length) {
				  if ( response.content.length > 1 ) {
				    this.rightDisabled = false;
          } else {
            this.rightDisabled = true;
            this.sliderBtnDisable = true;
          }
					this.reminders = response.content;
				} else {
					this.reminders = null;
				}
			}, (error) => {
				this.reminders = null;
			});
	}

	getPayments() {
		this.loaderIsVisiblePay = true;
		this.paymentHistoryService.getAllPayments(null, { pageSize: 4, pageIndex: 0 }, null, null, null, null)
			.pipe(
				finalize(() => {
					this.loaderIsVisiblePay = false;
				}))
			.subscribe((response: any) => {
				if (response.payments) {
					this.paymentsList.data = response.payments;
					this.tableLength = response.total;
				} else {
					this.paymentsList.data = [];
					this.tableLength = null;
				}
			}, (error) => {
				this.tableLength = null;
			});
	}

	getDraffts() {
		this.loaderIsVisibleDraf = true;
		this.reportApiServices.reports(1, null, { pageSize: 4, pageIndex: 0 }, null, null, null, null)
			.pipe(
				finalize(() => {
					this.loaderIsVisibleDraf = false;
				}))
			.subscribe((response: any) => {
				if (response.reports) {
					this.reportList.data = response.reports;
					this.tableLengthRepo = response.total;
				} else {
					this.reportList.data = [];
					this.tableLengthRepo = null;
				}
			}, (error) => {
				this.tableLengthRepo = null;
			});
	}

	getInvoice() {
		this.tableLengthInv = true;
		this.invoiceService.getAllInvoices(null, { pageSize: 1, pageIndex: 0 }, null, null, null, null, null, null)
			.pipe(
				finalize(() => {
					this.tableLengthInv = false;
				}))
			.subscribe((response: any) => {
				if (response.invoices) {
					this.lastInvoice = response.invoices[0];
					this.tableLengthInv = response.total;
				} else {
					this.reportList.data = [];
					this.tableLengthInv = null;
				}
			}, (error) => {
				this.tableLengthInv = null;
			});
	}

	setTime(time: any) {
		let s = time.split(' ').join('T');
		let t = new Date(s);
		return formatDate(t, 'h:mm a', 'en-US')
	}

	setDate(d: any) {
		let s = d.split(' ').join('T');
		let t = new Date(s);
		return formatDate(t, 'MMM d, yyyy', 'en-US')
	}

}
