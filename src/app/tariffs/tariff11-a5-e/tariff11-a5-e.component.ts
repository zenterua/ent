import { Component, OnInit, NgModule, ViewChild, HostListener, OnDestroy, Inject, LOCALE_ID } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import {slideUpDown, itemAnimation, animationPopup} from '../../_shared/animations';
import { patternCodeCanada } from '../../_shared/validators/canada-postal-code.validator';
import { floatNumberPattern } from '../../_shared/validators/float-number.validator';
import { trigger } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';

import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { TariffDetailService } from '../tariff.detail.service';
import { ReportApiServices } from '../../reports/report.api.services';
import { SelectTariffService } from '../../reports/new-report/select.tariff.service';

import { CanDeactivateService } from '../../reports/new-report/can.deactivate.service';
import { DialogService } from '../../_shared/services/dialog.service';
import { ReportCounterService } from '../../reports/draft-reports/report.counter.service';

@Component({
	selector: 'app-tariff11-a5-e',
	templateUrl: './tariff11-a5-e.component.html',
	animations: [
		trigger('slideUpDown', slideUpDown),
		trigger('itemAnimation', itemAnimation),
    trigger('animationPopup', animationPopup)
	]
})
export class Tariff11A5EComponent implements OnInit, OnDestroy {
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
	displayedColumns: string[] = ['Event', 'Venue', 'Promoter Name', 'Promoter Address', 'Date', 'Gross (CAD$)', 'menu'];
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
	tariffDetail: any;
	tariffDetailValues: any[] = [];
	tariffSeq: any;

	taxApiVlaue: any;
	reportId: any;
	reportIdSaved: any;
	openDesc: boolean;
	zeroReport: boolean;
	tariffSeqNumber: number = 110;
	@HostListener('window:beforeunload') alertConfirm() { return false; }
	private sub: Subscription;
	private subRoute: Subscription;
	private subTariff: Subscription;
	eventMaxDate: any;
	impersionateModeError: boolean;

	constructor(private tariffDetailService: TariffDetailService, private reportApiServices: ReportApiServices, private selectTariffService: SelectTariffService, private router: Router, public canDeactivateService: CanDeactivateService, public dialogService: DialogService, @Inject(LOCALE_ID) public localeId: string, private route: ActivatedRoute, private reportCounterService: ReportCounterService) {
		this.getYearsList(2019);

		this.calcForm = new FormGroup({
			'year': new FormControl(null, [Validators.required])
		});

		this.addEventForm = new FormGroup({
			'EVENT_NAME': new FormControl(null, [Validators.required]),
			'VENUE_NAME': new FormControl(null, [Validators.required]),
			'PROMOTER_NAME': new FormControl(null, [Validators.required]),
			'PROMOTER_ADDRESS': new FormControl(null, [Validators.required]),
			'PROMOTER_PROVINCE': new FormControl(null, [Validators.required]),
			'PROMOTER_CITY': new FormControl(null, [Validators.required]),
			'PROMOTER_POSTAL': new FormControl(null, [Validators.required, Validators.pattern(patternCodeCanada)]),
			'DATE': new FormControl(null, [Validators.required]),
			'GROSS': new FormControl(null, [Validators.required, Validators.pattern(floatNumberPattern)])
		});
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

		this.sub = this.calcForm.valueChanges.subscribe((val) => {
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

	getMaxDate(date) {
		let d = new Date();
		if (date.year == this.currentYear) {
		this.eventMaxDate = d;
		} else { this.eventMaxDate = new Date(date.year, 11, 31); }
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
						PROMOTER_NAME: item.PROMOTER,
						PROMOTER_ADDRESS: item.PROMOTER_ADDRESS,
						PROMOTER_PROVINCE: item.PROMOTER_PROVINCE,
						PROMOTER_CITY: item.PROMOTER_CITY,
						PROMOTER_POSTAL: item.PROMOTER_POSTAL,
						DATE: item.DATE_OF_EVENT,
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
	}

	onEditEvent() {
		if (this.addEventForm.valid) {
			let evArr: any = this.eventList.data;
			let form: any = this.addEventForm;
			Object.keys(evArr[this.editedEventIndex]).forEach((key) => {
				evArr[this.editedEventIndex].EVENT_NAME = form.get('EVENT_NAME').value;
				evArr[this.editedEventIndex].VENUE_NAME = form.get('VENUE_NAME').value;
				evArr[this.editedEventIndex].PROMOTER_NAME = form.get('PROMOTER_NAME').value;
				evArr[this.editedEventIndex].PROMOTER_ADDRESS = form.get('PROMOTER_ADDRESS').value;
				evArr[this.editedEventIndex].PROMOTER_PROVINCE = form.get('PROMOTER_PROVINCE').value;
				evArr[this.editedEventIndex].PROMOTER_CITY = form.get('PROMOTER_CITY').value;
				evArr[this.editedEventIndex].PROMOTER_POSTAL = form.get('PROMOTER_POSTAL').value;
				evArr[this.editedEventIndex].DATE = form.get('DATE').value;
				evArr[this.editedEventIndex].GROSS = form.get('GROSS').value;
			});
			this.eventList.data = [...evArr];
			this.popupEvent = false;
			this.calcTariff();
			this.addEvent.resetForm();
		}
	}

	addEventPopup() {
		this.popupEvent = true;
	}

	onAddEvent() {
		if (this.addEventForm.valid) {
			let evArr = this.eventList.data;
			evArr.push({
				EVENT_NAME: this.addEventForm.get('EVENT_NAME').value,
				VENUE_NAME: this.addEventForm.get('VENUE_NAME').value,
				PROMOTER_NAME: this.addEventForm.get('PROMOTER_NAME').value,
				PROMOTER_ADDRESS: this.addEventForm.get('PROMOTER_ADDRESS').value,
				PROMOTER_PROVINCE: this.addEventForm.get('PROMOTER_PROVINCE').value,
				PROMOTER_CITY: this.addEventForm.get('PROMOTER_CITY').value,
				PROMOTER_POSTAL: this.addEventForm.get('PROMOTER_POSTAL').value,
				DATE: this.addEventForm.get('DATE').value,
				GROSS: this.addEventForm.get('GROSS').value
			});
			this.eventList = new MatTableDataSource(evArr);
			this.setDataSourceAttributes();
			this.popupEvent = false;
			this.calcTariff();
			this.addEvent.resetForm();
		}
	}

	calcTariff() {
		this.resoundFees = 0;
		this.socanFees = 0;
		this.hstFees = 0;
		this.pstFees = 0;
		this.gstFees = 0;
		this.totalFees = 0;
		let total = 0;
		let percentSc = this.tariffDetailValues[0].PERCENT;
		let feeMinSc = this.tariffDetailValues[0].FEE_MINIMUM;
		let percentRs = this.tariffDetailValues[1].PERCENT;
		let feeMinRs = this.tariffDetailValues[1].FEE_MINIMUM;

		let eventArray: any = this.eventList.data;
		eventArray.forEach((val) => {
			let gstSc = 0;
			let pstSc = 0;
			let hstSc = 0;
			let gstRs = 0;
			let pstRs = 0;
			let hstRs = 0;

			let totalSc = parseFloat(((val.GROSS * (percentSc / 100)) > feeMinSc ? (val.GROSS * (percentSc / 100)) : feeMinSc).toFixed(2));
			this.taxApiVlaue.map((x) => {
				if (x.TAX_CODE == 'HST') hstSc = parseFloat((totalSc * x.RATE).toFixed(2));
				if (x.TAX_CODE == 'GST') gstSc = parseFloat((totalSc * x.RATE).toFixed(2));
				if (x.TAX_CODE == 'PST' || x.TAX_CODE == 'QST') pstSc = parseFloat((totalSc * x.RATE).toFixed(2));
			});
			this.hstFees += hstSc;
			this.gstFees += gstSc;
			this.pstFees += pstSc;
			let totalTaxSc = totalSc + hstSc + gstSc + pstSc;
			this.socanFees += totalSc;
			total += totalTaxSc;

			let totalRs = parseFloat(((val.GROSS * (percentRs / 100)) > feeMinRs ? (val.GROSS * (percentRs / 100)) : feeMinRs).toFixed(2));
			this.taxApiVlaue.map((x) => {
				if (x.TAX_CODE == 'HST') hstRs = parseFloat((totalRs * x.RATE).toFixed(2));
				if (x.TAX_CODE == 'GST') gstRs = parseFloat((totalRs * x.RATE).toFixed(2));
				if (x.TAX_CODE == 'PST' || x.TAX_CODE == 'QST') pstRs = parseFloat((totalRs * x.RATE).toFixed(2));
			});
			this.hstFees += hstRs;
			this.gstFees += gstRs;
			this.pstFees += pstRs;
			let totalTaxRs = totalRs + hstRs + gstRs + pstRs;
			this.resoundFees += totalRs;
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

}
