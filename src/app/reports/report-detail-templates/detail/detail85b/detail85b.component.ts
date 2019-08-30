import { Component, OnInit, Inject, LOCALE_ID, OnDestroy } from '@angular/core';
import { DataTemplateService } from '../../data.template.service';
import { UserDataService } from '../../../../header/user.data.service';
import { TariffDetailService } from '../../../../tariffs/tariff.detail.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-detail85b',
	templateUrl: './detail85b.component.html'
})
export class Detail85bComponent implements OnInit, OnDestroy {
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
	quarter: string;
	reportsArr: any[] = [];
	sortedArr: any[] = [];
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
		this.reportsArr.forEach((x) => {
			if (x.COMPANY == 'SOCAN') {
				this.socanFees += x.AMT_TO_BILL;
				this.sortedArr.push({
					ROOM_CAPACITY: x.ROOM_CAPACITY,
					NON_DANCE_EVENTS: x.NON_DANCE_EVENTS,
					DANCE_EVENTS: x.DANCE_EVENTS,
					ROOM_CAPACITY_NAME: this.roomCapacity(x.ROOM_CAPACITY)
				});
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


	roomCapacity(room) {
		switch (room) {
			case '100': return '1-100';
				break;
			case '300': return '101-300';
				break;
			case '500': return '301-500';
				break;
			case '999999': return this.localeId == 'fr' ? 'Plus de 500' : 'Over 500';
				break;
			default:
				break;
		}
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
