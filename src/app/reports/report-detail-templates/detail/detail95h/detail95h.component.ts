import { Component, OnInit, Inject, LOCALE_ID, OnDestroy } from '@angular/core';
import { DataTemplateService } from '../../data.template.service';
import { UserDataService } from '../../../../header/user.data.service';
import { TariffDetailService } from '../../../../tariffs/tariff.detail.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-detail95h',
	templateUrl: './detail95h.component.html'
})
export class Detail95hComponent implements OnInit, OnDestroy {
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
	sortedArr: any[] = [];
	zeroReport: boolean;
	quarter: string;
	province: any;
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
				this.setQuarter(value[0].VALID_MONTH);
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
			this.reportsArr.forEach((item) => {
				if (item.COMPANY == 'SOCAN') {
					this.sortedArr.push({
						EVENT_NAME: item.NAME_OF_EVENT,
						VENUE_NAME: item.VENUE,
						DATE: item.DATE_OF_EVENT,
						IS_FREE: item.GROSS_RECEIPTS ? 0 : 1,
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

	setQuarter(quarter) {
		switch (quarter) {
			case 'Q1': this.quarter = this.localeId == 'fr' ? '1er trimestre (janv.-mars)' : '1st Quarter (Jan to Mar)';
				break;
			case 'Q2': this.quarter = this.localeId == 'fr' ? '2e trimestre (avril-juin)' : '2nd Quarter (Apr to Jun)';
				break;
			case 'Q3': this.quarter = this.localeId == 'fr' ? '3e trimestre (juil.-sept.)' : '3rd Quarter (Jul to Sept)';
				break;
			case 'Q4': this.quarter = this.localeId == 'fr' ? '4e trimestre (oct.-déc.)' : '4th Quarter (Oct to Dec)';
				break;
			default:
				break;
		}
	}

}
