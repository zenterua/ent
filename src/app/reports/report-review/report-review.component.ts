import { Component, OnInit, OnDestroy, ViewContainerRef, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ReportApiServices } from '../report.api.services';
import { UserDataService } from '../../header/user.data.service';
import { DetailReportTemplate } from '../report-detail-templates/report.template.service';
import { DataTemplateService } from '../report-detail-templates/data.template.service';

@Component({
	selector: 'app-report-review',
	templateUrl: './report-review.component.html'
})
export class ReportReviewComponent implements OnInit, OnDestroy {
	userData: any = {};
	loaderIsVisible: boolean;
	reportNotExist: boolean;
	reportId: number;
	private sub: any;
	service: any;
	@ViewChild('dynamic', { read: ViewContainerRef }) viewContainerRef: ViewContainerRef;
	tariffDetail: any = {};
	isSubmitted: boolean;

	constructor(private userDataService: UserDataService, private route: ActivatedRoute, private reportApiServices: ReportApiServices, @Inject(DetailReportTemplate) service, private dataTemplateService: DataTemplateService) {
		this.service = service;
	}

	ngOnInit() {
		this.getLicenseeData();
		this.sub = this.route.params.subscribe(params => {
			this.reportId = +params['id'];
			this.getReportDetail();
		});
	}

    ngOnDestroy() {
		if (this.sub){this.sub.unsubscribe();}
	}

	getReportDetail() {
		this.loaderIsVisible = true;
		this.reportApiServices.reportDetail('reportId', this.reportId)
			.pipe(finalize(() => {
				this.loaderIsVisible = false;
				this.viewContainerRef.clear();
				this.service.setRootViewContainerRef(this.viewContainerRef);
				this.service.addDynamicComponent(this.tariffDetail.TRFF_NO, 'review');
			}))
			.subscribe((data) => {
				if (data) {
					this.tariffDetail = data[0];
					this.dataTemplateService.changeData([...data]);
					if (this.tariffDetail.FLAG_RPT_IN_PROGRESS == 'N') {
						this.isSubmitted = true;
					} else {
						this.isSubmitted = false;
					}
				} else {
					this.reportNotExist = true;
				}
			}, (error) => {
		
			});
	}

	getLicenseeData() {
		this.userDataService.currentData
			.subscribe((value) => {
				this.userData = value;
			});
	}

	

}
