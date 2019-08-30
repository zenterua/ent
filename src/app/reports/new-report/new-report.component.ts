import { Component, OnInit, Inject, ViewContainerRef, LOCALE_ID, ViewChild, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import {animationPopup, slideUpDown} from '../../_shared/animations';
import { trigger } from '@angular/animations';

import { SelectTariffTemplate } from './tariffs-template.service';
import { TariffsService } from '../../assign-tariff/tariffs.service';
import { UserDataService } from '../../header/user.data.service';
import { SelectTariffService } from './select.tariff.service';
import { CanDeactivateService } from './can.deactivate.service';
import { DialogService } from '../../_shared/services/dialog.service';

import { ReportApiServices } from '../report.api.services';
import { TariffDetailService } from '../../tariffs/tariff.detail.service';
import { ReportAgainService } from '../report-detail/report.again.service';

@Component({
	selector: 'app-new-report',
	templateUrl: './new-report.component.html',
	animations: [
		trigger('slideUpDown', slideUpDown),
    trigger('animationPopup', animationPopup)
	]
})
export class NewReportComponent implements OnInit, OnDestroy {
	popupTraiffs: boolean;
	loaderIsVisible: boolean;
	loaderIsVisibleAssigned: boolean;
	reportNotExist: boolean;
	noTariffs: boolean;
	unities: any[] = [];

	activeTariff: any;
	selectedTariff: any;
	userData: any = {};

	tariffs: any[] = [];
	tariffDesc: number = -1;
	service: any;

	unitiForm: FormGroup;
	reportDetailId: any;
	reportDetailType: any;
	taxApiVlaue: any[] = [];
	TrffData: any;
	tariffSelectedUnit: any;
	isSubmitted: boolean;
	private sub: Subscription;
	private subData: Subscription;
	private subReport: Subscription;

	@ViewChild('dynamic', { read: ViewContainerRef }) viewContainerRef: ViewContainerRef;

	constructor(@Inject(SelectTariffTemplate) service, private tariffsService: TariffsService, @Inject(LOCALE_ID) protected localeId: string, private userDataService: UserDataService, private selectTariffService: SelectTariffService, private route: ActivatedRoute, private reportApiServices: ReportApiServices, private tariffDetailService: TariffDetailService, public dialogService: DialogService, public canDeactivateService: CanDeactivateService, private reportAgainService: ReportAgainService) {
		this.service = service;
		this.unitiForm = new FormGroup({
			'selectedUnit': new FormControl(null, [Validators.required])
		});
	}

	ngOnInit() {
		this.getAssignedTariffs();
		this.subData = this.userDataService.currentData
			.subscribe((value) => {
				if (value.USER_ID) {
					this.userData = value;
					this.getTax(value.PROVINCE);
					this.loaderIsVisible = false;
				}
			});

		this.sub = this.route.params
			.subscribe(params => {
				if (params && params.id) {
					this.reportDetailId = params.id;
				} else {
					this.reportDetailId = null;
				}
			});

	}

	ngOnDestroy() {
		if (this.viewContainerRef) {
			this.viewContainerRef.clear();
			this.service.clearRootViewContainerRef(this.viewContainerRef);
		}
		if (this.canDeactivateService) { this.canDeactivateService.changeStatus(false); }
		if (this.sub) { this.sub.unsubscribe(); }
		if (this.subReport) { this.subReport.unsubscribe(); }
		if (this.subData) { this.subData.unsubscribe(); }
	}

	getReportDetail() {
		this.reportApiServices.reportDetail('reportId', this.reportDetailId)
			.subscribe((data) => {
				if (data) {
					if (data[0].FLAG_RPT_IN_PROGRESS == 'N' && !this.reportDetailType) {
						this.isSubmitted = true;
					} else {
						this.isSubmitted = false;
						this.reportTariffDetai(data);
						this.reportAgainService.changeData(null);
					}
				} else {
					this.reportNotExist = true;
				}
			});
	}

	getTax(province) {
		this.tariffDetailService.getTax(province)
			.pipe(finalize(() => {
				if (this.reportDetailId) {
					this.getReportDetail();
				} else {
					this.subReport = this.reportAgainService.currentData.subscribe((value) => {
						if (value && value.reportId) {
							this.reportDetailId = value.reportId;
							this.reportDetailType = value.reportType;
							this.getReportDetail();
						}
					});
				}
			}))
			.subscribe((data) => {
				this.taxApiVlaue = [...data];
			});

	}

	openDesc(index: number) {
		if (this.tariffDesc == index) {
			this.tariffDesc = -1;
		} else {
			this.tariffDesc = index;
		}
	}

	getAssignedTariffs() {
		this.noTariffs = false;
		this.loaderIsVisibleAssigned = true;
		this.tariffsService.assignedAllTariffs(1)
			.pipe(finalize(() => {
				this.loaderIsVisibleAssigned = false;
			}))
			.subscribe((data) => {
				if (data) {
					//				  data.forEach((i)=>{
					//					  if (i.TRFF_NO == 'SCE 8'){
					//						 this.tariffs.push(i);
					//					  }
					//				  });
					this.tariffs = data;
				} else {
					this.noTariffs = true;
				}
			}, (err) => {
				this.noTariffs = true;
			});
	}

	selectTariff(item: any, index: any) {
		if (this.activeTariff !== index) {
			this.activeTariff = index;
			this.selectedTariff = item;
			this.unities = [];
			this.tariffsService.getUnit(item.TRFF_GROUP)
				.pipe(finalize(() => {
					this.unitiForm.get('selectedUnit').setValue(this.unities[0])
				}))
				.subscribe((data) => {
					if (data) {
						this.unities = [...data];
					}
				});
		}
	}

	openPopupTraiffs() {
		this.tariffDesc = -1;
		this.popupTraiffs = true;
	}

	closePopupTariffs() {
		this.popupTraiffs = false;
	}

	setComponent() {
		this.selectTariffService.changeData(this.TrffData);
		this.viewContainerRef.clear();
		this.service.setRootViewContainerRef(this.viewContainerRef);
		this.service.addDynamicComponent(this.TrffData.tariffSeq);
	}

	reportTariff() {
		this.popupTraiffs = false;
		this.TrffData = {
			tariffSeq: this.selectedTariff ? this.selectedTariff.TRFF_NO : null,
			province: this.userData ? this.userData.PROVINCE : null,
			unitId: this.unitiForm.get('selectedUnit').value ? this.unitiForm.get('selectedUnit').value.ACCT_TRFF_ID : null,
			tariffDetail: null,
			tax: this.taxApiVlaue,
			roomName: this.unitiForm.get('selectedUnit').value.ROOM_NAME
		};
		this.setComponent();
	}

	reportTariffDetai(item) {
		this.TrffData = {
			tariffSeq: item[0].TRFF_NO,
			province: this.userData.PROVINCE,
			unitId: item[0].ACCT_TRFF_ID,
			tariffDetail: [...item],
			tax: this.taxApiVlaue,
			roomName: item[0].ROOM_NAME
		};
		this.setComponent();
	}

}
