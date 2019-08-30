import { Component, OnInit, NgModule, HostListener, OnDestroy, Inject, LOCALE_ID } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { trigger } from '@angular/animations';
import {slideUpDown, itemAnimation, animationPopup} from '../../_shared/animations';
import { TariffDetailService } from '../tariff.detail.service';
import { ReportApiServices } from '../../reports/report.api.services';
import { SelectTariffService } from '../../reports/new-report/select.tariff.service';
import { CanDeactivateService } from '../../reports/new-report/can.deactivate.service';
import { DialogService } from '../../_shared/services/dialog.service';
import { ReportCounterService } from '../../reports/draft-reports/report.counter.service';

@Component({
	selector: 'app-tariff8-5b',
	templateUrl: './tariff8-5b.component.html',
	animations: [
		trigger('slideUpDown', slideUpDown),
		trigger('itemAnimation', itemAnimation),
    trigger('animationPopup', animationPopup)
	]
})
export class Tariff85bComponent implements OnInit, OnDestroy {
	calcForm: FormGroup;
	loaderIsVisible: boolean;
	serverError: boolean;
	saveReport: boolean;
	years: any[] = [];
	socanFees: any = 0;
	resoundFees: any = 0;
	hstFees: number = 0;
	pstFees: number = 0;
	gstFees: number = 0;
	totalFees: number = 0;
	hstTaxCode: boolean;
	pstTaxCode: boolean;
	gstTaxCode: boolean;
	province: any;
	ROOM_CAPACITY: any[] = [];
	quartersArr: any[] = [];
	quarters: any[] = [];
	currentYear = new Date().getFullYear();
	currentMonth = new Date().getMonth();
	tariffDetail: any;
	tariffDetailValues: any[] = [];
	tariffSeq: any;
	isliveOnly: boolean;
	taxApiVlaue: any;
	reportId: any;
	openDesc: boolean;
	continueReview: boolean;
	resultRoomArray: any[] = [];
	selectliveOnly = new FormControl(false);
	canAddRoom: any[] = [];
	candeactivate: boolean = true;
	tariffSeqNumber: number = 80;
	@HostListener('window:beforeunload') alertConfirm() { return false; }
	private sub: Subscription;
	private subRoute: Subscription;
	private subTariff: Subscription;
	eventMaxDate: any;
	impersionateModeError: boolean;

	constructor(private fb: FormBuilder, private tariffDetailService: TariffDetailService, private reportApiServices: ReportApiServices, private selectTariffService: SelectTariffService, private router: Router, public canDeactivateService: CanDeactivateService, public dialogService: DialogService, private reportCounterService: ReportCounterService, @Inject(LOCALE_ID) public localeId: string, private route: ActivatedRoute) {
		this.ROOM_CAPACITY = [
			{ name: '1-100', value: '100' },
			{ name: '101-300', value: '300' },
			{ name: '301-500', value: '500' },
			{ name: this.localeId == 'fr' ? 'Plus de 500' : 'Over 500', value: '999999' }
		];

		this.quartersArr = [
			{ value: 'Q1', viewValue: this.localeId == 'fr' ? '1er trimestre (janv.-mars)' : '1st Quarter (Jan to Mar)' },
			{ value: 'Q2', viewValue: this.localeId == 'fr' ? '2e trimestre (avril-juin)' : '2nd Quarter (Apr to Jun)' },
			{ value: 'Q3', viewValue: this.localeId == 'fr' ? '3e trimestre (juil.-sept.)' : '3rd Quarter (Jul to Sept)' },
			{ value: 'Q4', viewValue: this.localeId == 'fr' ? '4e trimestre (oct.-déc.)' : '4th Quarter (Oct to Dec)' }
		];

		this.getYearsList(2019);
		this.calcForm = this.fb.group({
			'year': new FormControl(null, [Validators.required]),
			'quarter': new FormControl(null, [Validators.required]),
			'liveOnly': new FormControl(0),
			'isSave': new FormControl(1),
			'acctTariffId': new FormControl(null),
			'reportId': new FormControl(null),
			'rooms': this.fb.array([])
		});
		this.quarters = [...this.quartersArr];
		this.addNewRoom();

		this.calcForm.get('rooms').valueChanges.subscribe((value) => {
			this.continueReview = value.some((element) => ((+element.NON_DANCE_EVENTS >= 0 && element.NON_DANCE_EVENTS !== null && element.NON_DANCE_EVENTS !== '') || (+element.DANCE_EVENTS >= 0 && element.DANCE_EVENTS !== null && element.DANCE_EVENTS !== '')));
		});
	}


	ngOnInit() {
		this.canDeactivateService.changeStatus(true);
		this.subTariff = this.selectTariffService.currentData
			.subscribe((value) => {
				if (value) {
					this.tariffSeq = value;
					this.calcForm.get('acctTariffId').setValue(this.tariffSeq.unitId);
					this.getTariffDetail(this.tariffSeqNumber);
					this.taxApiVlaue = value.tax;
					this.province = this.taxApiVlaue[0].PROVINCE_ID;
					this.getTAxCode(value.tax);
				}
			});

		this.sub = this.calcForm.get('year').valueChanges.subscribe((val) => {
			this.getMaxDate(val);
		});

		this.subRoute = this.route.params.subscribe(params => {
			if (params && params.id) { this.reportId = params.id; }
		});

	}

	ngOnDestroy() {
		if (this.sub) { this.sub.unsubscribe(); }
		if (this.subRoute) { this.subRoute.unsubscribe(); }
		if (this.subTariff) { this.subTariff.unsubscribe(); }
	}

	getMaxDate(year) {
		let d = new Date();
		if (year == this.currentYear) {
		this.eventMaxDate = d;
		} else { this.eventMaxDate = new Date(year, 11, 31); }
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

	getTariffDetail(tariffSeq: any) {
		this.tariffDetailService.getDetail(tariffSeq)
			.pipe(finalize(() => {
				if (this.tariffSeq.tariffDetail) {
					this.setDetailValue(this.tariffSeq.tariffDetail);
				}
			}))
			.subscribe((data) => {
				if (data) {
					this.tariffDetail = data;
					this.tariffDetailValues = data.DETAILS;
				}
			});
	}

	get formData() { return <FormArray>this.calcForm.get('rooms'); }

	addNewRoom() {
		let control = <FormArray>this.calcForm.controls.rooms;
		this.ROOM_CAPACITY.forEach(x => {
			control.push(this.fb.group({
				ROOM_CAPACITY: +x.value,
				ROOM_CAPACITY_NAME: x.name,
				ROOM_CHECKED: new FormControl(false),
				NON_DANCE_EVENTS: null,
				DANCE_EVENTS: null
			}))
		});
	}

	calcTariff() {
		this.socanFees = 0;
		this.resoundFees = 0;
		this.totalFees = 0;
		this.hstFees = 0;
		this.pstFees = 0;
		this.gstFees = 0;
		this.resultRoomArray = [];
		let total: any = 0;
		let totalFloat: any = 0;
		let taxSc: any = 0;
		let taxRe: any = 0;
		this.calcForm.get('rooms').value.forEach(x => {
			let gstSc = 0;
			let pstSc = 0;
			let hstSc = 0;
			let gstRs = 0;
			let pstRs = 0;
			let hstRs = 0;
			let WOD = x['NON_DANCE_EVENTS'] ? +x['NON_DANCE_EVENTS'] : 0;
			let WDC = x['DANCE_EVENTS'] ? +x['DANCE_EVENTS'] : 0;
			let totalSc = 0;
			totalSc = parseFloat((this.getTariffValue(+x['ROOM_CAPACITY'], 'WOD', 'SOCAN') * WOD + this.getTariffValue(+x['ROOM_CAPACITY'], 'WDC', 'SOCAN') * WDC).toFixed(2));
			this.socanFees += totalSc;
			this.taxApiVlaue.map((x) => {
				if (x.TAX_CODE == 'HST') hstSc = parseFloat((totalSc * x.RATE).toFixed(2));
				if (x.TAX_CODE == 'GST') gstSc = parseFloat((totalSc * x.RATE).toFixed(2));
				if (x.TAX_CODE == 'PST' || x.TAX_CODE == 'QST') pstSc = parseFloat((totalSc * x.RATE).toFixed(2));
			});
			this.hstFees += hstSc;
			this.gstFees += gstSc;
			this.pstFees += pstSc;
			let totalTaxSc = totalSc + hstSc + gstSc + pstSc;
			total += totalTaxSc;

			let totalRs = 0;
			totalRs = this.calcForm.get('liveOnly').value == 0 ? parseFloat((this.getTariffValue(+x['ROOM_CAPACITY'], 'WOD', 'RESOUND') * WOD + this.getTariffValue(+x['ROOM_CAPACITY'], 'WDC', 'RESOUND') * WDC).toFixed(2)) : 0;
			this.resoundFees += totalRs;
			this.taxApiVlaue.map((x) => {
				if (x.TAX_CODE == 'HST') hstRs = parseFloat((totalRs * x.RATE).toFixed(2));
				if (x.TAX_CODE == 'GST') gstRs = parseFloat((totalRs * x.RATE).toFixed(2));
				if (x.TAX_CODE == 'PST' || x.TAX_CODE == 'QST') pstRs = parseFloat((totalRs * x.RATE).toFixed(2));
			});
			this.hstFees += hstRs;
			this.gstFees += gstRs;
			this.pstFees += pstRs;
			let totalTaxRs = totalRs + hstRs + gstRs + pstRs;
			total += totalTaxRs;

			if ((x.DANCE_EVENTS >= 0 || x.NON_DANCE_EVENTS >= 0) && (x.DANCE_EVENTS !== null || x.NON_DANCE_EVENTS !== null)) {
				this.resultRoomArray.push(x);
			}
		});
		this.totalFees = parseFloat(total.toFixed(2));
	}

	getTariffValue(room: any, type: string, company: string): number {
		let UNIT_CHARGE;
		this.tariffDetailValues.forEach(y => {
			if (y['COMPANY'] == company && room == y['UPPER_BOUND'] && y['TYPE_OF_UNIT'] == type) {
				UNIT_CHARGE = y['UNIT_CHARGE'];
			}
		});
		return UNIT_CHARGE;
	}

	setDetailValue(arr) {
		let isResound = arr.some(element => element.COMPANY == 'RESOUND');
		this.calcForm.get('year').setValue(arr[0].VALID_YEAR);
		this.calcForm.get('quarter').setValue(arr[0].VALID_MONTH);
		this.calcForm.get('reportId').setValue(this.reportId);
		this.calcForm.get('isSave').setValue(1);
		this.calcForm.get('acctTariffId').setValue(arr[0].ACCT_TRFF_ID);
		this.selectliveOnly.setValue(!isResound);
		this.calcForm.get('liveOnly').setValue(isResound ? 0 : 1);
		this.isliveOnly = !isResound;

		arr.forEach((x) => {
			if (x.COMPANY == 'SOCAN') {
				this.calcForm.get('rooms')['controls'].forEach((val) => {
					if (x.ROOM_CAPACITY == val.get('ROOM_CAPACITY').value) {
						if (+x.NON_DANCE_EVENTS >= 0 || +x.DANCE_EVENTS >= 0) {
							val.get('NON_DANCE_EVENTS').setValue(x.NON_DANCE_EVENTS.toString());
							val.get('DANCE_EVENTS').setValue(x.DANCE_EVENTS.toString());
							val.get('ROOM_CAPACITY').setValue(x.ROOM_CAPACITY);
							this.resultRoomArray.push({
								NON_DANCE_EVENTS: x.NON_DANCE_EVENTS,
								DANCE_EVENTS: x.DANCE_EVENTS,
								ROOM_CAPACITY: x.ROOM_CAPACITY
							});
							val.get('ROOM_CHECKED').setValue(true);
						}
					}
				});
			}
		});
		this.calcTariff();
	}

	sendFees(step) {
		this.canDeactivateService.changeStatus(false);
		this.loaderIsVisible = true;
		this.calcForm.value.rooms = [...this.resultRoomArray];
		this.serverError = false;
		this.reportApiServices.calculate(this.tariffSeqNumber, this.calcForm.value)
			.pipe(finalize(() => {
				this.loaderIsVisible = false;
				this.saveReport = false
			}))
			.subscribe((data) => {
				if (this.totalFees == data.totalSum) {
					this.setDrafftsAmount();
					this.reportId = data.reportId
					if (step == 'close') {
						this.router.navigate(['/reports/draft-reports']);
					} else {
						this.router.navigate(['/reports/report-review', this.reportId]);
					}
				} else {
					this.serverError = true;
				}
			}, (error) => {
				this.serverError = true;
				if (error.error.errorCode == 3) {
					this.impersionateModeError = true;
				}
			});
	}

    setDrafftsAmount(){
		this.reportApiServices.reports(1, null, { pageSize: 0, pageIndex: 0 }, null, null, null, null)
		.subscribe((response: any) => {
			if (response.reports) {
				 this.reportCounterService.changeNumber(response.total)
			}
		});
	}

	activateRoom(event, i) {
		if (event.checked == true) {
			this.calcForm.get('rooms')['controls'][i].get('NON_DANCE_EVENTS').setValue('0');
			this.calcForm.get('rooms')['controls'][i].get('DANCE_EVENTS').setValue('0');
		} else {
			this.calcForm.get('rooms')['controls'][i].get('NON_DANCE_EVENTS').reset();
			this.calcForm.get('rooms')['controls'][i].get('NON_DANCE_EVENTS').setValue(null);
			this.calcForm.get('rooms')['controls'][i].get('DANCE_EVENTS').reset();
			this.calcForm.get('rooms')['controls'][i].get('DANCE_EVENTS').setValue(null);
		}
		this.calcTariff();
	}

	isValueSelected(index) {
		this.calcTariff();
	}

	continueEnable() {
		if (this.calcForm.valid && this.continueReview) {
			return false;
		} else {
			return true;
		}
	}

	isOnlySocan() {
		this.isliveOnly = !this.isliveOnly;
		this.calcForm.get('liveOnly').setValue(this.isliveOnly ? 1 : 0);
		this.calcTariff();
	}

	getYearsList(start: any) {
		for (var i = start; i <= this.currentYear; i++) {
			this.years.push(i);
		}
	}

	curentQuarter() {
		this.quarters = [];
		let currentQ = [...this.quartersArr];
		if (this.currentMonth == 0 || this.currentMonth == 1 || this.currentMonth == 2) {
			this.quarters = [...currentQ.splice(0, 1)];
		} else if (this.currentMonth == 3 || this.currentMonth == 4 || this.currentMonth == 5) {
			this.quarters = [...currentQ.splice(0, 2)];
		} else if (this.currentMonth == 6 || this.currentMonth == 7 || this.currentMonth == 8) {
			this.quarters = [...currentQ.splice(0, 3)];
		} else if (this.currentMonth == 9 || this.currentMonth == 10 || this.currentMonth == 11) {
			this.quarters = [...currentQ.splice(0, 4)];
		}
	}

	setQuarter() {
		if (this.calcForm.get('year').value == this.currentYear) {
			this.curentQuarter();
		} else {
			this.quarters = [...this.quartersArr];
		}
	}

}
