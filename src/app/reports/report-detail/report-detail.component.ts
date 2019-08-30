import { Component, OnInit, OnDestroy, ViewContainerRef, ViewChild, Inject, LOCALE_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { ReportApiServices } from '../report.api.services';
import { UserDataService } from '../../header/user.data.service';
import { DetailReportTemplate } from '../report-detail-templates/report.template.service';
import { DataTemplateService } from '../report-detail-templates/data.template.service';
import { ReportAgainService } from './report.again.service';

@Component({
	selector: 'app-report-detail',
	templateUrl: './report-detail.component.html'
})
export class ReportDetailComponent implements OnInit, OnDestroy {
	userData: any = {};
	loaderIsVisible: boolean;
	reportId: number;
	reportType: any;
	private sub: any;
	totalAmount: number = 0;
	service: any;
	@ViewChild('dynamic', { read: ViewContainerRef }) viewContainerRef: ViewContainerRef;
	tariffDetail: any = {};
	isLoading: boolean;
	constructor(private userDataService: UserDataService, private router: Router, private route: ActivatedRoute, private reportApiServices: ReportApiServices, @Inject(DetailReportTemplate) service, private dataTemplateService: DataTemplateService, @Inject(LOCALE_ID) public localeId: string, private reportAgainService: ReportAgainService) {
		this.service = service;
	}

	ngOnInit() {
		this.getLicenseeData();
		this.sub = this.route.params.subscribe(params => {
			this.reportId = +params['id'];
			this.reportType = params['type'];
			this.getReportDetail();
		});
	}

	reportAgain() {
		this.reportAgainService.changeData({
			reportId: this.reportId,
			reportType: this.reportType
		});

		this.router.navigate(['/reports/new-report']);

	}

	getReportDetail() {
		this.reportApiServices.reportDetail(this.reportType, this.reportId)
			.pipe(finalize(() => {
				this.viewContainerRef.clear();
				this.service.setRootViewContainerRef(this.viewContainerRef);
				this.service.addDynamicComponent(this.tariffDetail.TRFF_NO, 'detail');
				this.loaderIsVisible = false;
			}))
			.subscribe((data) => {
				if (data) {
					this.tariffDetail = data[0];
					if (this.tariffDetail.TRFF_NO == 'SCE 8' || this.tariffDetail.TRFF_NO == 'SCE 10A' || this.tariffDetail.TRFF_NO == 'RSE 5G' || this.tariffDetail.TRFF_NO == 'RSE 5B') {
						this.calcFeesType1(data);
					} else {
						this.calcFeesType2(data);
					}
					this.dataTemplateService.changeData([...data]);
				}
			});
	}

	calcFeesType1(arr) {
		arr.map((item) => {
			this.totalAmount += item.AMT_TO_BILL + item.GST_AMT + item.HST_AMT + item.PST_AMT;
		});
	}

	calcFeesType2(arr) {
		let totalSc = 0;
		let totalRs = 0;
		arr.map((item) => {
			if (item.COMPANY == 'SOCAN') {
				totalSc = item.AMT_TO_BILL + item.GST_AMT + item.HST_AMT + item.PST_AMT;
			}
			if (item.COMPANY == 'RESOUND') {
				totalRs = item.AMT_TO_BILL + item.GST_AMT + item.HST_AMT + item.PST_AMT;
			}
		});
		this.totalAmount = totalSc + totalRs;
	}

	getLicenseeData() {
		this.loaderIsVisible = true;
		this.userDataService.currentData
			.pipe(finalize(() => {
				this.loaderIsVisible = false;
			}))
			.subscribe((value) => {
				this.userData = value;
			});
	}

	getFilePdf(act) {
		this.isLoading = true;
		this.reportApiServices.reportDownload(this.reportType, this.reportId, 'Report_detail_' + this.reportId, act, this.localeId == 'fr' ? 'F' : '')
			.pipe(finalize(() => {
				this.isLoading = false;
			}))
			.subscribe((data) => {

			})
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

}
