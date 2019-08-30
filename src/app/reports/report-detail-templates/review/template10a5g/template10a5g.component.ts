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
	selector: 'app-template10a5g',
	templateUrl: './template10a5g.component.html',
  animations: [trigger('animationPopup', animationPopup)]
})
export class Template10a5gComponent implements OnInit, OnDestroy {
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
	liveOnly: any;
	province: any;

	tariffSeqNumber: number = 100;
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
				this.liveOnly = this.reportsArr.some(element => element.COMPANY == 'RESOUND');
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

	setDays(end: any, start: any) {
		let resultDays: any;
		let startDay: any = new Date(start);
		let endDay: any = new Date(end);
		return resultDays = (endDay - startDay) / (1000 * 60 * 60 * 24) + 1;
	}

	sendFees(save) {
		let calcObj = {
			year: this.reportsArr[0].VALID_YEAR,
			liveOnly: this.liveOnly ? 0 : 1,
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
		if (this.reportsArr.length == 2 && this.reportsArr[0].AMT_TO_BILL == 0 && this.reportsArr[1].AMT_TO_BILL == 0) {
			this.zeroReport = true;
		} else {
			this.zeroReport = false;
			let groupArr = [];
			let resStatus;
			const groupedCollectionStatus = this.reportsArr.reduce((previous, current) => {
				if (!previous[current['SEQ_NO']]) {
					previous[current['SEQ_NO']] = [current];
				} else {
					previous[current['SEQ_NO']].push(current);
				}
				return previous;
			}, {});
			resStatus = Object.keys(groupedCollectionStatus).map(key => ({ SEQ_NO: key, reports: groupedCollectionStatus[key] }));
			groupArr = [...resStatus];
			groupArr.forEach((i) => {
				let isLive;
				if (i.reports.length == 2) {
					isLive = 0;
				} else { isLive = 1; }
				this.eventsArr.push({
					EVENT_NAME: i.reports[0].EVENT_NAME,
					START_DATE: i.reports[0].START_DATE,
					END_DATE: i.reports[0].STOP_DATE,
					LIVE_ONLY: isLive,
					DAYS: this.setDays(i.reports[0].STOP_DATE, i.reports[0].START_DATE)
				});
			});
			this.calcValues();
		}
	}

	calcValues() {
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
	}

	openTermsPopup(event) {
		event.preventDefault();
		this.openTerms = true;
	}

}

