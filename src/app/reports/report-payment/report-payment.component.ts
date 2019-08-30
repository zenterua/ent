import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ReportApiServices } from '../report.api.services';
import { TariffDetailService } from '../../tariffs/tariff.detail.service';
import { UserDataService } from '../../header/user.data.service';

@Component({
	selector: 'app-report-payment',
	templateUrl: './report-payment.component.html'
})
export class ReportPaymentComponent implements OnInit, OnDestroy {
	socanFees: number = 0;
	resoundFees: number = 0;
	hstFees: number = 0;
	pstFees: number = 0;
	gstFees: number = 0;
	totalFees: number = 0;
	hstTaxCode: boolean;
	pstTaxCode: boolean;
	gstTaxCode: boolean;
	province: any;

	loaderIsVisible: boolean;
	serverError: boolean;

	reportsArr: any[] = [];
	tariffDetail: any = {};
	taxApiVlaue: any = {};
	reportId: number;
	totalToPay: any;
	private sub: any;

	constructor(private reportApiServices: ReportApiServices, private route: ActivatedRoute, private userDataService: UserDataService, private tariffDetailService: TariffDetailService) {

	}

	ngOnInit() {
		this.sub = this.route.params.subscribe(params => {
			this.reportId = +params['id'];
			this.getReportDetail();
		});

		this.userDataService.currentData
			.subscribe((value) => {
				if (value.USER_ID) {
					this.province = value.PROVINCE;
					this.getTax(value.PROVINCE);
				}
			});
	}

	getTax(province) {
		this.tariffDetailService.getTax(province)
			.subscribe((data) => {
				if (data) {
					this.getTAxCode(data);
				}
			});
	}

	getTAxCode(data) {
		if (data) {
			data.forEach((tax) => {
				if (tax.TAX_CODE == 'GST') { this.gstTaxCode = true; }
				if (tax.TAX_CODE == 'PST' || tax.TAX_CODE == 'QST') { this.pstTaxCode = true; }
				if (tax.TAX_CODE == 'HST') { this.hstTaxCode = true; }
			});
		}
	}

	getReportDetail() {
		this.loaderIsVisible = true;
		this.reportApiServices.reportDetail('reportId', this.reportId)
			.pipe(finalize(() => {
				this.loaderIsVisible = false;
				if (this.tariffDetail.TRFF_NO == 'SCE 8' || this.tariffDetail.TRFF_NO == 'SCE 10A' || this.tariffDetail.TRFF_NO == 'RSE 5G' || this.tariffDetail.TRFF_NO == 'RSE 5B') {
					this.calcFeesType1();
				} else {
					this.calcFeesType2();
				}
			}))
			.subscribe((data) => {
				if (data) {
					this.reportsArr = [...data];
                    this.tariffDetail = data[0];
				}
			});
	}

	calcFeesType1() {
		this.reportsArr.forEach((x) => {
			if (x.COMPANY == 'SOCAN') {
				this.socanFees += x.AMT_TO_BILL;
			}
			if (x.COMPANY == 'RESOUND') {
				this.resoundFees += x.AMT_TO_BILL;
			}
			this.hstFees += x.HST_AMT;
			this.pstFees += x.PST_AMT;
			this.gstFees += x.GST_AMT;
			this.totalFees += x.TRANS_AMT;
		});
		this.totalToPay = this.totalFees.toFixed(2);
	}

	calcFeesType2() {
		let totalSc = 0;
		let totalRs = 0;
		let hstSc = 0;
		let pstSc = 0;
		let gstSc = 0;
		let hstRs = 0;
		let pstRs = 0;
		let gstRs = 0;
		this.reportsArr.forEach((x) => {
			if (x.COMPANY == 'SOCAN') {
				this.socanFees = x.AMT_TO_BILL;
				totalSc = x.TRANS_AMT;
				hstSc = x.HST_AMT;
				pstSc = x.PST_AMT;
				gstSc = x.GST_AMT;
			}
			if (x.COMPANY == 'RESOUND') {
				this.resoundFees = x.AMT_TO_BILL;
				totalRs = x.TRANS_AMT;
				hstRs = x.HST_AMT;
				pstRs = x.PST_AMT;
				gstRs = x.GST_AMT;
			}
			this.hstFees = hstSc + hstRs;
			this.pstFees = pstSc + pstRs;
			this.gstFees = gstSc + gstRs;
			this.totalFees = totalSc + totalRs;
		});

		this.totalToPay = this.totalFees.toFixed(2);
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

}
