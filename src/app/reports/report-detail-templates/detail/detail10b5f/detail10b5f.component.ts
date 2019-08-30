import { Component, OnInit, Inject, LOCALE_ID, OnDestroy } from '@angular/core';
import { DataTemplateService } from '../../data.template.service';
import { UserDataService } from '../../../../header/user.data.service';
import { TariffDetailService } from '../../../../tariffs/tariff.detail.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-detail10b5f',
	templateUrl: './detail10b5f.component.html'
})
export class Detail10b5fComponent implements OnInit, OnDestroy {
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

	calcFees() {
		if (this.reportsArr.length == 2 && this.reportsArr[0].AMT_TO_BILL == 0 && this.reportsArr[1].AMT_TO_BILL == 0) {
			this.zeroReport = true;
		} else {
			this.zeroReport = false;
			let groupArr = [];
			let resStatus;
			const groupedCollectionStatus = this.reportsArr.reduce((previous, current) => {
				if (!previous[current['REPORT_DETAIL_SEQ']]) {
					previous[current['REPORT_DETAIL_SEQ']] = [current];
				} else {
					previous[current['REPORT_DETAIL_SEQ']].push(current);
				}
				return previous;
			}, {});
			resStatus = Object.keys(groupedCollectionStatus).map(key => ({ REPORT_DETAIL_SEQ: key, reports: groupedCollectionStatus[key] }));
			groupArr = [...resStatus];
			groupArr.forEach((i) => {
				let isLive;
				if (i.reports.length == 2) {
					isLive = 0;
				} else { isLive = 1; }
				if (i.reports[0].REPORT_DETAIL_SEQ) {
					this.sortedArr.push({
						EVENT_NAME: i.reports[0].NAME_OF_EVENT,
						DATE: i.reports[0].DATE_OF_EVENT,
						BANDS: i.reports[0].NUMBER_OF_CONCERTS,
						LIVE_ONLY: isLive
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

}
