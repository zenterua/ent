import { Component, OnInit, NgModule, ViewChild, HostListener, OnDestroy, Inject, LOCALE_ID } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import {slideUpDown, itemAnimation, animationPopup} from '../../_shared/animations';
import { patternCodeCanada } from '../../_shared/validators/canada-postal-code.validator';
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
	selector: 'app-tariff4-b1',
	templateUrl: './tariff4-b1.component.html',
	animations: [
		trigger('slideUpDown', slideUpDown),
		trigger('itemAnimation', itemAnimation),
    trigger('animationPopup', animationPopup)
	]
})
export class Tariff4B1Component implements OnInit, OnDestroy {
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
	displayedColumns: string[] = ['Concert Act', 'Venue', 'Venue Address', 'Attendance', 'Promoter Name', 'Promoter Address', 'Date', 'Gross Sales/ Fees (CAD$)', 'Performer Fee (CAD$)', 'menu'];
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
	grossLessZero: boolean;
	tariffSeqNumber: number = 41;

	@HostListener('window:beforeunload') alertConfirm() {
		return false;
	}
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
			'CONCERT_ACT': new FormControl(null, [Validators.required]),
			'VENUE_NAME': new FormControl(null, [Validators.required]),
			'VENUE_ADDRESS': new FormControl(null, [Validators.required]),
			'VENUE_PROVINCE': new FormControl(null, [Validators.required]),
			'VENUE_CITY': new FormControl(null, [Validators.required]),
			'VENUE_POSTAL': new FormControl(null, [Validators.required, Validators.pattern(patternCodeCanada)]),
			'ATTENDANCE': new FormControl(null, [Validators.required, Validators.pattern(floatNumberPattern)]),
			'PROMOTER_NAME': new FormControl(null, [Validators.required]),
			'PROMOTER_ADDRESS': new FormControl(null, [Validators.required]),
			'PROMOTER_PROVINCE': new FormControl(null, [Validators.required]),
			'PROMOTER_CITY': new FormControl(null, [Validators.required]),
			'PROMOTER_POSTAL': new FormControl(null, [Validators.required, Validators.pattern(patternCodeCanada)]),
			'DATE': new FormControl(null, [Validators.required]),
			'IS_PERFORMER_FEE': new FormControl(null, [Validators.required]),
			'FEE': new FormControl(null, [Validators.required, Validators.pattern(floatNumberPattern)])
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
			if (params && params.id) { this.reportId = params.id; this.reportIdSaved = null; }
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
						CONCERT_ACT: item.PERFORMER,
						VENUE_NAME: item.VENUE,
						VENUE_ADDRESS: item.VENUE_ADDRESS,
						VENUE_PROVINCE: item.VENUE_PROVINCE,
						VENUE_CITY: item.VENUE_CITY,
						VENUE_POSTAL: item.VENUE_POSTAL,
						ATTENDANCE: item.ATTENDANCE,
						PROMOTER_NAME: item.PROMOTER,
						PROMOTER_ADDRESS: item.PROMOTER_ADDRESS,
						PROMOTER_PROVINCE: item.PROMOTER_PROVINCE,
						PROMOTER_CITY: item.PROMOTER_CITY,
						PROMOTER_POSTAL: item.PROMOTER_POSTAL,
						DATE: item.DATE_OF_EVENT,
						IS_PERFORMER_FEE: item.GROSS_RECEIPTS ? 0 : 1,
						FEE: item.GROSS_RECEIPTS ? item.GROSS_RECEIPTS : item.FEES_PAID_TO_PERFORMERS
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
		this.addEventForm.get('IS_PERFORMER_FEE').patchValue(item.IS_PERFORMER_FEE.toString());
	}

	onEditEvent() {
		if (this.addEventForm.valid) {
			if (+this.addEventForm.get('FEE').value <= 0) {
				this.grossLessZero = true;
			} else {
				this.grossLessZero = false;
				let evArr: any = this.eventList.data;
				let form: any = this.addEventForm;
				Object.keys(evArr[this.editedEventIndex]).forEach((key) => {
					evArr[this.editedEventIndex].CONCERT_ACT = form.get('CONCERT_ACT').value;
					evArr[this.editedEventIndex].VENUE_NAME = form.get('VENUE_NAME').value;
					evArr[this.editedEventIndex].VENUE_ADDRESS = form.get('VENUE_ADDRESS').value;
					evArr[this.editedEventIndex].VENUE_PROVINCE = form.get('VENUE_PROVINCE').value;
					evArr[this.editedEventIndex].VENUE_CITY = form.get('VENUE_CITY').value;
					evArr[this.editedEventIndex].VENUE_POSTAL = form.get('VENUE_POSTAL').value;
					evArr[this.editedEventIndex].ATTENDANCE = form.get('ATTENDANCE').value;
					evArr[this.editedEventIndex].PROMOTER_NAME = form.get('PROMOTER_NAME').value;
					evArr[this.editedEventIndex].PROMOTER_ADDRESS = form.get('PROMOTER_ADDRESS').value;
					evArr[this.editedEventIndex].PROMOTER_PROVINCE = form.get('PROMOTER_PROVINCE').value;
					evArr[this.editedEventIndex].PROMOTER_CITY = form.get('PROMOTER_CITY').value;
					evArr[this.editedEventIndex].PROMOTER_POSTAL = form.get('PROMOTER_POSTAL').value;
					evArr[this.editedEventIndex].DATE = form.get('DATE').value;
					evArr[this.editedEventIndex].IS_PERFORMER_FEE = +form.get('IS_PERFORMER_FEE').value;
					evArr[this.editedEventIndex].FEE = form.get('FEE').value;
				});
				this.eventList.data = [...evArr];
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
			if (+this.addEventForm.get('FEE').value <= 0) {
				this.grossLessZero = true;
			} else {
				this.grossLessZero = false;
				let evArr = this.eventList.data;
				evArr.push({
					CONCERT_ACT: this.addEventForm.get('CONCERT_ACT').value,
					VENUE_NAME: this.addEventForm.get('VENUE_NAME').value,
					VENUE_ADDRESS: this.addEventForm.get('VENUE_ADDRESS').value,
					VENUE_PROVINCE: this.addEventForm.get('VENUE_PROVINCE').value,
					VENUE_CITY: this.addEventForm.get('VENUE_CITY').value,
					VENUE_POSTAL: this.addEventForm.get('VENUE_POSTAL').value,
					ATTENDANCE: this.addEventForm.get('ATTENDANCE').value,
					PROMOTER_NAME: this.addEventForm.get('PROMOTER_NAME').value,
					PROMOTER_ADDRESS: this.addEventForm.get('PROMOTER_ADDRESS').value,
					PROMOTER_PROVINCE: this.addEventForm.get('PROMOTER_PROVINCE').value,
					PROMOTER_CITY: this.addEventForm.get('PROMOTER_CITY').value,
					PROMOTER_POSTAL: this.addEventForm.get('PROMOTER_POSTAL').value,
					DATE: this.addEventForm.get('DATE').value,
					IS_PERFORMER_FEE: +this.addEventForm.get('IS_PERFORMER_FEE').value,
					FEE: this.addEventForm.get('FEE').value
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
		this.resoundFees = 0;
		this.socanFees = 0;
		this.hstFees = 0;
		this.pstFees = 0;
		this.gstFees = 0;
		this.totalFees = 0;
		let total = 0;
		let percentSc = this.tariffDetailValues[0].PERCENT;
		let feeMinSc = this.tariffDetailValues[0].FEE_MINIMUM;

		let gstRs = 0;
		let pstRs = 0;
		let hstRs = 0;
		let eventArray: any = this.eventList.data;
		eventArray.forEach((val) => {
			let gstSc = 0;
			let pstSc = 0;
			let hstSc = 0;
			let totalSc = parseFloat((((val.FEE * (percentSc / 100)) < feeMinSc && val.FEE) ? feeMinSc : (val.FEE * (percentSc / 100))).toFixed(2));
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
