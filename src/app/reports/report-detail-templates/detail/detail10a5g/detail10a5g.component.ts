import { Component, OnInit, Inject, LOCALE_ID, OnDestroy } from '@angular/core';
import { DataTemplateService } from '../../data.template.service';
import { UserDataService } from '../../../../header/user.data.service';
import { TariffDetailService } from '../../../../tariffs/tariff.detail.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-detail10a5g',
	templateUrl: './detail10a5g.component.html'
})
export class Detail10a5gComponent implements OnInit, OnDestroy {
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
	reportsArr: any[] = [];
	sortedArr: any[] = [];
	zeroReport: boolean;
    tarrifSub:Subscription;
	tarrifTaxSub:Subscription;
	
	constructor(private dataTemplateService: DataTemplateService, private userDataService: UserDataService, private tariffDetailService: TariffDetailService, @Inject(LOCALE_ID) public localeId: string) { }

	ngOnInit() {
		this.tarrifSub = this.dataTemplateService.currentData
			.subscribe((value) => {
				this.reportsArr = [...value];
				if (value[0].EVENT_PROV_POSTAL) {
					this.getTax(value[0].EVENT_PROV_POSTAL.substring(0, 2));
					this.province = value[0].EVENT_PROV_POSTAL.substring(0, 2);
				} else {
					this.getUserDataProvince();
				}
				this.calcFees();
			});
	}

    ngOnDestroy(){
		if (this.tarrifSub){this.tarrifSub.unsubscribe();}
		if (this.tarrifTaxSub){this.tarrifTaxSub.unsubscribe();}
	}

	getUserDataProvince() {
		this.tarrifTaxSub = this.userDataService.currentData
		.subscribe((value) => {
			this.getTax(value.PROVINCE);
			this.province = value.PROVINCE;
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

	setDays(end: any, start: any) {
		let resultDays: any;
		let startDay: any = new Date(start);
		let endDay: any = new Date(end);
		return resultDays = (endDay - startDay) / (1000 * 60 * 60 * 24) + 1;
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
				this.sortedArr.push({
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

}