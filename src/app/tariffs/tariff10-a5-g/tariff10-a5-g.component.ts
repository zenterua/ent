import { Component, OnInit, NgModule, ViewChild, HostListener, OnDestroy, Inject, LOCALE_ID } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { trigger } from '@angular/animations';
import {slideUpDown, itemAnimation, animationPopup} from '../../_shared/animations';
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
	selector: 'app-tariff10-a5-g',
	templateUrl: './tariff10-a5-g.component.html',
	animations: [
		trigger('slideUpDown', slideUpDown),
		trigger('itemAnimation', itemAnimation),
    trigger('animationPopup', animationPopup)
	]
})
export class Tariff10A5GComponent implements OnInit, OnDestroy {
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
	displayedColumns: string[] = ['Event', 'Start Date', 'End Date', '# Days', '# Days Live Music Only', 'menu'];
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

	isliveOnly: number = 0;
	tariffSeqNumber: number = 100;
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
			'START_DATE': new FormControl(null, [Validators.required]),
			'END_DATE': new FormControl(null, [Validators.required]),
			'LIVE_ONLY': new FormControl(0)
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
			let groupArr = [];
			let resStatus;
			const groupedCollectionStatus = arr.reduce((previous, current) => {
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
				evArr.push({
					EVENT_NAME: i.reports[0].EVENT_NAME,
					START_DATE: i.reports[0].START_DATE,
					END_DATE: i.reports[0].STOP_DATE,
					LIVE_ONLY: isLive,
					DAYS: this.setDays(i.reports[0].STOP_DATE, i.reports[0].START_DATE)
				});
			});
			this.eventList = new MatTableDataSource(evArr);
			this.setDataSourceAttributes();
			this.calcTariff();
		}
	}


	setDays(end: any, start: any) {
		let resultDays: any;
		let startDay: any = new Date(start);
		let endDay: any = new Date(end);
		return resultDays = (endDay - startDay) / (1000 * 60 * 60 * 24) + 1;
	}

	editEvent(index: any, item: any) {
		this.popupEvent = true;
		this.editedEventIndex = index;
		this.addEventForm.patchValue(item);
	}

	onEditEvent() {
		let daysCount: any = 0;
		if (this.addEventForm.valid) {
			let evArr: any = this.eventList.data;
			daysCount = this.setDays(this.addEventForm.get('END_DATE').value, this.addEventForm.get('START_DATE').value); let form: any = this.addEventForm;

			Object.keys(evArr[this.editedEventIndex]).forEach((key) => {
				evArr[this.editedEventIndex].EVENT_NAME = form.get('EVENT_NAME').value;
				evArr[this.editedEventIndex].START_DATE = form.get('START_DATE').value;
				evArr[this.editedEventIndex].END_DATE = form.get('END_DATE').value;
				evArr[this.editedEventIndex].LIVE_ONLY = this.isliveOnly;
				evArr[this.editedEventIndex].DAYS = daysCount;
			});
			this.eventList.data = [...evArr];
			this.popupEvent = false;
			this.calcTariff();
			this.addEvent.resetForm();
		}
	}

	addEventPopup() {
		this.popupEvent = true;
		this.isliveOnly = 0;
	}

	onAddEvent() {
		let daysCount: any = 0;
		if (this.addEventForm.valid) {
			let evArr = this.eventList.data;
			daysCount = this.setDays(this.addEventForm.get('END_DATE').value, this.addEventForm.get('START_DATE').value);
			evArr.push({
				EVENT_NAME: this.addEventForm.get('EVENT_NAME').value,
				START_DATE: this.addEventForm.get('START_DATE').value,
				END_DATE: this.addEventForm.get('END_DATE').value,
				LIVE_ONLY: this.isliveOnly,
				DAYS: daysCount
			});
			this.eventList = new MatTableDataSource(evArr);
			this.setDataSourceAttributes();
			this.popupEvent = false;
			this.calcTariff();
			this.addEvent.resetForm();
		}
	}

	setLiveOnly(event) {
		if (event.checked) {
			this.isliveOnly = 1;
		} else {
			this.isliveOnly = 0;
		}
	}

	calcTariff() {
		let taxSc: any = 0;
		let taxRs: any = 0;
		let maxSumSc = this.tariffDetailValues[0].FEE_MAXIMUM;
		let maxSumRs = this.tariffDetailValues[1].FEE_MAXIMUM;
		let feeSc = this.tariffDetailValues[0].FEE_FLAT;
		let feeRs = this.tariffDetailValues[1].FEE_FLAT;
		this.socanFees = 0;
		this.resoundFees = 0;
		this.hstFees = 0;
		this.pstFees = 0;
		this.gstFees = 0;

		this.totalFees = 0;
		let total = 0;
		let allSum = 0;
		let eventArray: any = this.eventList.data;
		eventArray.forEach((val) => {
			let gstSc = 0;
			let pstSc = 0;
			let hstSc = 0;
			let gstRs = 0;
			let pstRs = 0;
			let hstRs = 0;

			let days = parseInt(val.DAYS);
			let count90 = Math.floor(days / 90);
			let rest90 = days % 90;
			let totalSc = 0;
			if (count90) { totalSc = count90 * maxSumSc; }
			totalSc += (feeSc * rest90) > maxSumSc ? maxSumSc : (feeSc * rest90);
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
			this.socanFees += totalSc;
			total += totalTaxSc;

			if (val.LIVE_ONLY == 0) {
				let totalRs = 0;
				if (count90) { totalRs = count90 * maxSumRs; }
				totalRs += (feeRs * rest90) > maxSumRs ? maxSumRs : (feeRs * rest90);
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
				this.resoundFees += totalRs;
				total += totalTaxRs;
			}
		});
		this.totalFees = parseFloat(total.toFixed(2));
		this.editedEventIndex = -1;
	};

	closePopupEvent() {
		this.popupEvent = false;
		this.isliveOnly = 0;
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
