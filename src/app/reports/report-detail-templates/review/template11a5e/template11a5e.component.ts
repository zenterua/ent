import { Component, OnInit, Inject, LOCALE_ID, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UserDataService } from '../../../../header/user.data.service';
import { DataTemplateService } from '../../data.template.service';
import { ReportApiServices } from '../../../report.api.services';
import { TariffDetailService } from '../../../../tariffs/tariff.detail.service';
import { ReportCounterService } from '../../../../reports/draft-reports/report.counter.service';
import {trigger} from '@angular/animations';
import {animationPopup} from '../../../../_shared/animations';

@Component({
	selector: 'app-template11a5e',
	templateUrl: './template11a5e.component.html',
  animations: [trigger('animationPopup', animationPopup)]
})
export class Template11a5eComponent implements OnInit, OnDestroy {
	socanFees: number = 0;
	resoundFees: number = 0;
	hstFees: number = 0;
	pstFees: number = 0;
	gstFees: number = 0;
	totalFees: number = 0;
	hstTaxCode: boolean;
	pstTaxCode: boolean;
	gstTaxCode: boolean;

	reportsArr: any[] = [];
	quarter: string;
	eventsArr: any[] = [];

	licenseForm: FormGroup;
	saveReport: boolean;
	openTerms: boolean;
	loaderIsVisible: boolean;
	serverError: boolean;
	zeroReport: boolean;
	province: any;

	tariffSeqNumber: number = 110;
    tarrifSub:Subscription;
	tarrifTaxSub:Subscription;

	constructor(private dataTemplateService: DataTemplateService, private router: Router, private reportApiServices: ReportApiServices, private userDataService: UserDataService, @Inject(LOCALE_ID) public localeId: string, private tariffDetailService: TariffDetailService, private reportCounterService: ReportCounterService) {
		this.licenseForm = new FormGroup({
			'termsAndConditions': new FormControl(false, Validators.pattern('true')),
		});
	}

	ngOnInit() {
		this.tarrifSub = this.dataTemplateService.currentData
			.subscribe((value) => {
				this.reportsArr = [...value];
				this.calcFees();
				if (value[0].EVENT_PROV_POSTAL) {
					this.getTax(value[0].EVENT_PROV_POSTAL.substring(0, 2));
					this.province = value[0].EVENT_PROV_POSTAL.substring(0, 2);
				} else {
					this.getUserDataProvince();
				}
			});
	}

    ngOnDestroy(){
		if (this.tarrifSub){this.tarrifSub.unsubscribe();}
		if (this.tarrifTaxSub){this.tarrifTaxSub.unsubscribe();}
	}

	getUserDataProvince() {
		this.tarrifTaxSub = this.userDataService.currentData
		.subscribe((value) => {
			this.province = value.PROVINCE;
			this.getTax(value.PROVINCE);
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
		data.forEach((tax) => {
			if (tax.TAX_CODE == 'GST') { this.gstTaxCode = true; }
			if (tax.TAX_CODE == 'PST' || tax.TAX_CODE == 'QST') { this.pstTaxCode = true; }
			if (tax.TAX_CODE == 'HST') { this.hstTaxCode = true; }
		});
	}

	sendFees(save) {
		let calcObj = {
			year: this.reportsArr[0].VALID_YEAR,
			reportId: this.reportsArr[0].REPORT_ID,
			acctTariffId: this.reportsArr[0].ACCT_TRFF_ID,
			isSave: save,
			events: [...this.eventsArr]
		}
		this.loaderIsVisible = true;
		this.serverError = false;
		this.saveReport = false;
		this.reportApiServices.calculate(this.tariffSeqNumber, calcObj)
			.pipe(finalize(() => {
				this.loaderIsVisible = false;
			}))
			.subscribe((data) => {
				if (data) {
					if (save == 0) {
						this.setDrafftsAmount();
						this.router.navigate(['/reports/report-payment/', this.reportsArr[0].REPORT_ID]);
					} else {
						this.router.navigate(['/reports/draft-reports']);
					}
				} else {
					this.serverError = true;
				}

			}, (error) => {
				this.serverError = true;
			});
	}

    setDrafftsAmount(){
		this.reportApiServices.reports(1, null, { pageSize: 0, pageIndex: 0 }, null, null, null, null)
		.subscribe((response: any) => {

			if (response.reports) {
				 this.reportCounterService.changeNumber(response.total);
			}else{
				 this.reportCounterService.changeNumber(0);
			}
		});
	}

	calcFees() {
		if ((this.reportsArr.length <= 2 && this.reportsArr[0].AMT_TO_BILL == 0) || (this.reportsArr.length == 2 && this.reportsArr[1].AMT_TO_BILL == 0 && this.reportsArr[0].AMT_TO_BILL == 0)) {
			this.zeroReport = true;
		} else {
			this.zeroReport = false;
			this.reportsArr.forEach((item) => {
				if (item.COMPANY == 'SOCAN') {
					this.eventsArr.push({
						EVENT_NAME: item.NAME_OF_EVENT,
						VENUE_NAME: item.VENUE,
						PROMOTER_NAME: item.PROMOTER,
						PROMOTER_ADDRESS: item.PROMOTER_ADDRESS,
						PROMOTER_PROVINCE: item.PROMOTER_PROVINCE,
						PROMOTER_CITY: item.PROMOTER_CITY,
						PROMOTER_POSTAL: item.PROMOTER_POSTAL,
						DATE: item.DATE_OF_EVENT,
						GROSS: item.GROSS_RECEIPTS
					});
				}
			});
			this.calcValues();
		}
	}

	calcValues() {
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
	}

	openTermsPopup(event) {
		event.preventDefault();
		this.openTerms = true;
	}

}
