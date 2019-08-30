import {Component, Inject, OnInit, LOCALE_ID, ViewChild, ViewContainerRef} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {AdminReportsService} from '../admin.reports.service';
import {finalize} from 'rxjs/operators';
import {AdminTemplateService} from '../admin.template.service';
import {AdminReportDataService} from '../admin.report.data.service';
import {AdminShareService} from '../../admin-shared/admin.share.service';
import {Reports} from '../../admin-shared/admin.interfaces';

@Component({
  selector: 'app-admin-report-detail',
  templateUrl: './admin-report-detail.component.html'
  })
  export class AdminReportDetailComponent implements OnInit {
    showTariffError = false;
    totalAmount = 0;
    loaderIsVisible = false;
    service: any;
    snapshotType: string;
    snapshotId: string;
    tariffInfo: Reports;
    @ViewChild('dynamic', {read: ViewContainerRef}) viewContainerRef: ViewContainerRef;
    constructor(private location: Location,
                private activatedRoute: ActivatedRoute,
                private adminReportsService: AdminReportsService,
                private adminDataService: AdminReportDataService,
                @Inject(AdminTemplateService) service,
                @Inject(LOCALE_ID) public localeId: string,
                private adminShareService: AdminShareService) {
      this.service = service;
    }
    ngOnInit() {

      this.snapshotType = this.activatedRoute.snapshot.params.type;
      this.snapshotId = this.activatedRoute.snapshot.params.id;
      this.loaderIsVisible = true;
      this.adminReportsService.getDetailReport(this.snapshotType, this.snapshotId).pipe(
        finalize(() => {
          this.loaderIsVisible = false;

        })
      ).subscribe((response: Reports) => {
        if ( response ) {
          this.getTariffinfo(response);
          this.tariffInfo = response[0];
          this.adminDataService.sendReportData(response);
          this.service.setViewContainer(this.viewContainerRef);
          this.service.addDynamicComponent(response[0].TRFF_NO);
        } else {
          this.showTariffError = true;
        }
      }, (error: any) => {
        this.showTariffError = true;
      });
      this.viewContainerRef.clear();

    }
    print() {
      setTimeout(() => {
        window.print();
      });
    }
  reportDownload(type: string) {
    const lang = this.localeId === 'fr' ? 'F' : 'E';
    this.loaderIsVisible = true;
    this.adminShareService.reportDownload(this.snapshotType, this.snapshotId, 'Report_detail_' + this.snapshotId, type, lang).pipe(
      finalize(() => {
        this.loaderIsVisible = false;
      })
    ).subscribe((response) => {}, (error) => {
    });
  }
  getTariffinfo(tariff) {
    if (tariff.TRFF_NO == 'SCE 8' || tariff.TRFF_NO == 'SCE 10A' || tariff.TRFF_NO == 'RSE 5G' || tariff.TRFF_NO == 'RSE 5B'){
      this.calcFeesType1(tariff);
    }else{
      this.calcFeesType2(tariff);
    }

  }
  calcFeesType1(arr){
	  arr.map((item) => {
      this.totalAmount += item.AMT_TO_BILL + item.GST_AMT + item.HST_AMT + item.PST_AMT;
	  });
  }
  calcFeesType2(arr){
	  let totalSc = 0;
	  let totalRs = 0;
	  arr.map((item) => {
		  if (item.COMPANY == 'SOCAN'){
			  totalSc = item.AMT_TO_BILL + item.GST_AMT + item.HST_AMT + item.PST_AMT;
		  }
		  if (item.COMPANY == 'RESOUND'){
			  totalRs = item.AMT_TO_BILL + item.GST_AMT + item.HST_AMT + item.PST_AMT;
		  }
	  });
     this.totalAmount = totalSc + totalRs;
  }
  setDate(date: any) {
    return this.adminShareService.setDate(date);
  }
}
