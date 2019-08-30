import { Component, OnInit, NgModule, ViewChild, HostListener, OnDestroy, Inject, LOCALE_ID } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import {slideUpDown, itemAnimation, animationPopup} from '../../_shared/animations';
import { floatNumberPattern } from '../../_shared/validators/float-number.validator';
import { trigger } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { TariffDetailService } from '../tariff.detail.service';
import { ReportApiServices } from '../../reports/report.api.services';
import { SelectTariffService } from '../../reports/new-report/select.tariff.service';
import { CanDeactivateService } from '../../reports/new-report/can.deactivate.service';
import { DialogService } from '../../_shared/services/dialog.service';
import { ReportCounterService } from '../../reports/draft-reports/report.counter.service';

@Component({
	selector: 'app-tariff9-5h',
	templateUrl: './tariff9-5h.component.html',
	animations: [
		trigger('slideUpDown', slideUpDown),
		trigger('itemAnimation', itemAnimation),
    trigger('animationPopup', animationPopup)
	]
})
export class Tariff95hComponent implements OnInit, OnDestroy {
	private paginator: MatPaginator;
	@ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
		this.paginator = mp;
		this.setDataSourceAttributes();
	}
	eventList = new MatTableDataSource();
	popupEvent: boolean
	addEventForm: FormGroup;
	@ViewChild('addEvent') addEvent;
	editedEventIndex: any = -1;
	eventRemove: boolean;
	removeIndex: any;
	displayedColumns: string[] = ['Event', 'Venue', 'Date', 'Gross', 'menu'];
	calcForm: FormGroup;
	loaderIsVisible: boolean;
	serverError: boolean;
	saveReport: boolean;
	years: any[] = [];
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
	currentYear = new Date().getFullYear();
	currentMonth = new Date().getMonth();
	tariffDetail: any;
	tariffDetailValues: any[] = [];
	tariffSeq: any;

	taxApiVlaue: any;
	reportId: any;
	reportIdSaved: any;
	openDesc: boolean;
	zeroReport: boolean;
	grossZero: boolean;
	quartersArr: any[] = [];
	quarters: any[] = [];
	tariffSeqNumber: number = 90;
	@HostListener('window:beforeunload') alertConfirm() {
		return false;
	}
	eventMaxDate: any;
	eventMinDate: any;
	private sub: Subscription;
	private subRoute: Subscription;
	private subTariff: Subscription;
	impersionateModeError: boolean;

	constructor(private tariffDetailService: TariffDetailService, private reportApiServices: ReportApiServices, private selectTariffService: SelectTariffService, private router: Router, public canDeactivateService: CanDeactivateService, public dialogService: DialogService, @Inject(LOCALE_ID) public localeId: string, private route: ActivatedRoute, private reportCounterService: ReportCounterService) {
		this.getYearsList(2019);
		this.quartersArr = [
			{ value: 'Q1', viewValue: this.localeId == 'fr' ? '1er trimestre (janv.-mars)' : '1st Quarter (Jan to Mar)' },
			{ value: 'Q2', viewValue: this.localeId == 'fr' ? '2e trimestre (avril-juin)' : '2nd Quarter (Apr to Jun)' },
			{ value: 'Q3', viewValue: this.localeId == 'fr' ? '3e trimestre (juil.-sept.)' : '3rd Quarter (Jul to Sept)' },
			{ value: 'Q4', viewValue: this.localeId == 'fr' ? '4e trimestre (oct.-déc.)' : '4th Quarter (Oct to Dec)' }
		];

		this.calcForm = new FormGroup({
			'year': new FormControl(null, [Validators.required]),
			'quarter': new FormControl(null, [Validators.required])
		});
		this.addEventForm = new FormGroup({
			'EVENT_NAME': new FormControl(null, [Validators.required]),
			'VENUE_NAME': new FormControl(null),
			'DATE': new FormControl(null, [Validators.required]),
			'IS_FREE': new FormControl('0', [Validators.required]),
			'GROSS': new FormControl(null, [Validators.required, Validators.pattern(floatNumberPattern)])
		});
		this.quarters = [...this.quartersArr];
	}

	ngOnInit() {
		this.canDeactivateService.changeStatus(true);
		this.subTariff = this.selectTariffService.currentData
			.subscribe((value) => {
				if (value) {
					this.tariffSeq = value;
					this.getTariffDetail(this.tariffSeqNumber);
					this.taxApiVlaue = value.tax;
					this.province = this.taxApiVlaue[0].PROVINCE_ID;
					this.getTAxCode(value.tax);
				}
			});

		this.sub = this.addEventForm.get('IS_FREE').valueChanges.subscribe((val) => {
			if (val == '1') {
				this.addEventForm.get('GROSS').clearValidators();
				this.addEventForm.get('GROSS').setValue(null);
				this.addEventForm.get('GROSS').disable();
			} else {
				this.addEventForm.get('GROSS').setValidators([Validators.required, Validators.pattern(floatNumberPattern)]);
				this.addEventForm.get('GROSS').enable();
				this.addEventForm.get('GROSS').updateValueAndValidity();
			}
		});

		this.subRoute = this.route.params.subscribe(params => {
			if (params && params.id) { this.reportId = params.id; this.reportIdSaved = null; }
		});
	}

	ngOnDestroy() {
		if (this.sub) { this.sub.unsubscribe(); }
		if (this.subRoute) { this.subRoute.unsubscribe(); }
		if (this.subTariff) { this.subTariff.unsubscribe(); }
	}

	setMaxDate(monthStart, monthEnd, year, day) {
		const d = new Date();
		let m = d.getMonth();
		let curentYear = d.getFullYear();
		if ((monthStart <= m && monthEnd >= m) && year == curentYear) {
			this.eventMaxDate = new Date();
		} else {
			this.eventMaxDate = new Date(year, monthEnd, day);
		}
	}

	getMaxMinDate(year, quarter) {
		switch (quarter) {
			case 'Q1':
				this.eventMinDate = new Date(year, 0, 1);
				this.setMaxDate(0, 2, year, 31);
				break;
			case 'Q2':
				this.eventMinDate = new Date(year, 3, 1);
				this.setMaxDate(3, 5, year, 30);
				break;
			case 'Q3':
				this.eventMinDate = new Date(year, 6, 1);
				this.setMaxDate(6, 8, year, 30);
				break;
			case 'Q4':
				this.eventMinDate = new Date(year, 9, 1);
				this.setMaxDate(9, 11, year, 31);
				break;
			default:
				break;
		}
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
					this.reportIdSaved = this.tariffSeq.tariffDetail[0].REPORT_ID ? this.tariffSeq.tariffDetail[0].REPORT_ID : this.tariffSeq.tariffDetail[0].REPORT_NO
					this.setDetailValue(this.tariffSeq.tariffDetail);
				}
				this.loaderIsVisible = true;
			}))
			.subscribe((data) => {
				if (data) {
					this.tariffDetail = data;
					this.tariffDetailValues = data.DETAILS;

				}
			});
	}

	setDataSourceAttributes() {
		this.eventList.paginator = this.paginator;
	}

	setDetailValue(arr) {
		this.calcForm.get('year').setValue(arr[0].VALID_YEAR);
		this.calcForm.get('quarter').setValue(arr[0].VALID_MONTH);
		this.getMaxMinDate(arr[0].VALID_YEAR, arr[0].VALID_MONTH);
		if ((arr.length <= 2 && arr[0].AMT_TO_BILL == 0) || (arr.length == 2 && arr[1].AMT_TO_BILL == 0 && arr[0].AMT_TO_BILL == 0)) {
			this.zeroReport = true;
		} else {
			this.zeroReport = false;
			let evArr = this.eventList.data;
			arr.forEach((item) => {
				if (item.COMPANY == 'SOCAN') {
					evArr.push({
						EVENT_NAME: item.NAME_OF_EVENT,
						VENUE_NAME: item.VENUE,
						DATE: item.DATE_OF_EVENT,
						IS_FREE: item.GROSS_RECEIPTS ? 0 : 1,
						GROSS: item.GROSS_RECEIPTS
					});
				}
			})
			this.eventList = new MatTableDataSource(evArr);
			this.setDataSourceAttributes();
			this.calcTariff();
		}
	}

	editEvent(index: any, item: any) {
		this.popupEvent = true;
		this.editedEventIndex = index;
		this.addEventForm.patchValue(item);
		this.addEventForm.get('IS_FREE').patchValue(item.IS_FREE.toString());
	}

	onEditEvent() {
		if (this.addEventForm.valid) {
			if (+this.addEventForm.get('GROSS').value <= 0 && this.addEventForm.get('IS_FREE').value == '0') {
				this.grossZero = true;
			} else {
				this.grossZero = false;
				let evArr: any = this.eventList.data;
				let form: any = this.addEventForm;
				Object.keys(evArr[this.editedEventIndex]).forEach((key) => {
					evArr[this.editedEventIndex].EVENT_NAME = form.get('EVENT_NAME').value;
					evArr[this.editedEventIndex].VENUE_NAME = form.get('VENUE_NAME').value;
					evArr[this.editedEventIndex].DATE = form.get('DATE').value;
					evArr[this.editedEventIndex].IS_FREE = +form.get('IS_FREE').value;
					evArr[this.editedEventIndex].GROSS = +form.get('GROSS').value;
				});
				this.eventList = new MatTableDataSource(evArr);
				this.popupEvent = false;
				this.calcTariff();
				this.addEvent.resetForm();
			}
		}
	}

	addEventPopup() {
		this.popupEvent = true;
	}

	onAddEvent() {
		if (this.addEventForm.valid) {
			if (+this.addEventForm.get('GROSS').value <= 0 && this.addEventForm.get('IS_FREE').value == '0') {
				this.grossZero = true;
			} else {
				this.grossZero = false;
				let evArr = this.eventList.data;
				evArr.push({
					EVENT_NAME: this.addEventForm.get('EVENT_NAME').value,
					VENUE_NAME: this.addEventForm.get('VENUE_NAME').value,
					DATE: this.addEventForm.get('DATE').value,
					IS_FREE: +this.addEventForm.get('IS_FREE').value,
					GROSS: +this.addEventForm.get('GROSS').value
				});
				this.eventList = new MatTableDataSource(evArr);
				this.setDataSourceAttributes();
				this.popupEvent = false;
				this.calcTariff();
				this.addEvent.resetForm();
			}
		}
	}

	calcTariff() {
		let taxSc = 0;
		let taxRs = 0;
		let total = 0;
		let feeSc = this.tariffDetailValues[0].FEE_FLAT;
		let percentSc = this.tariffDetailValues[0].PERCENT;
		let feeRs = this.tariffDetailValues[1].FEE_FLAT;
		let percentRs = this.tariffDetailValues[1].PERCENT;
		this.socanFees = 0;
		this.resoundFees = 0;
		this.hstFees = 0;
		this.pstFees = 0;
		this.gstFees = 0;
		this.totalFees = 0;
		let eventArray: any = this.eventList.data;
		eventArray.forEach((val) => {
			let gstSc = 0;
			let pstSc = 0;
			let hstSc = 0;
			let gstRs = 0;
			let pstRs = 0;
			let hstRs = 0;
			let totalSc = 0;
			if (val.IS_FREE == '1') {
				totalSc = parseFloat(feeSc.toFixed(2));
			} else {
				totalSc = parseFloat((val.GROSS * (percentSc / 100)).toFixed(2));
			}
			this.socanFees += totalSc;
			this.taxApiVlaue.map((x) => {
				if (x.TAX_CODE == 'HST') hstSc = parseFloat((totalSc * x.RATE).toFixed(2));
				if (x.TAX_CODE == 'GST') gstSc = parseFloat((totalSc * x.RATE).toFixed(2));
				if (x.TAX_CODE == 'PST' || x.TAX_CODE == 'QST') pstSc = parseFloat((totalSc * x.RATE).toFixed(2));
			});
			this.hstFees += hstSc;
			this.gstFees += gstSc;
			this.pstFees += pstSc;
			taxSc += hstSc + gstSc + pstSc;
			let totalTaxSc = totalSc + hstSc + gstSc + pstSc;
			total += totalTaxSc;

			let totalRs = 0;
			if (val.IS_FREE == '1') {
				totalRs = parseFloat(feeRs.toFixed(2));
			} else {
				totalRs = parseFloat((val.GROSS * (percentRs / 100)).toFixed(2));
			}
			this.resoundFees += totalRs;
			this.taxApiVlaue.map((x) => {
				if (x.TAX_CODE == 'HST') hstRs = parseFloat((totalRs * x.RATE).toFixed(2));
				if (x.TAX_CODE == 'GST') gstRs = parseFloat((totalRs * x.RATE).toFixed(2));
				if (x.TAX_CODE == 'PST' || x.TAX_CODE == 'QST') pstRs = parseFloat((totalRs * x.RATE).toFixed(2));
			});
			this.hstFees += hstRs;
			this.gstFees += gstRs;
			this.pstFees += pstRs;
			taxRs += gstRs + pstRs + hstRs;
			let totalTaxRs = totalRs + gstRs + pstRs + hstRs;
			total += totalTaxRs;
		});
		this.totalFees = parseFloat(total.toFixed(2));
		this.editedEventIndex = -1;
	};

	closePopupEvent() {
		this.popupEvent = false;
		this.addEvent.resetForm();
	}

	removeEvent(index: any) {
		this.eventRemove = true;
		this.removeIndex = index;
	}

	consfirmRemove() {
		let evArr = this.eventList.data;
		evArr.splice(this.removeIndex, 1);
		this.eventList = new MatTableDataSource(evArr);
		this.setDataSourceAttributes();
		this.eventRemove = false;
		this.removeIndex = undefined;
		this.calcTariff();
		this.addEvent.resetForm();
	}

	sendFees(step) {
		this.canDeactivateService.changeStatus(false);
		this.loaderIsVisible = false;
		let dataObj = {
			year: this.calcForm.get('year').value,
			quarter: this.calcForm.get('quarter').value,
			isSave: 1,
			acctTariffId: this.tariffSeq.unitId,
			reportId: this.reportId ? this.reportIdSaved : null,
			events: this.eventList ? [...this.eventList.data] : null
		};
		this.reportApiServices.calculate(this.tariffSeqNumber, dataObj)
			.pipe(finalize(() => {
				this.loaderIsVisible = true;
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

	getYearsList(start: any) { for (var i = start; i <= this.currentYear; i++) { this.years.push(i); } }

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
		this.getMaxMinDate(this.calcForm.get('year').value, this.calcForm.get('quarter').value);
		if (this.calcForm.get('year').value == this.currentYear) {
			this.curentQuarter();
		} else {
			this.quarters = [...this.quartersArr];
		}
	}

}
