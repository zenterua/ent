import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../_shared/shared.module';

import { SelectTariffTemplate } from './new-report/tariffs-template.service';
import { TariffsService } from '../assign-tariff/tariffs.service';
import { ReportApiServices } from './report.api.services';

import { TariffDetailService } from '../tariffs/tariff.detail.service';

import { ReportsRoutingModule } from './reports-routing.module';
import { NewReportComponent } from './new-report/new-report.component';
import { SubmittedReportsComponent } from './submitted-reports/submitted-reports.component';
import { DraftReportsComponent } from './draft-reports/draft-reports.component';
import { ReportDetailComponent } from './report-detail/report-detail.component';
import { ReportReviewComponent } from './report-review/report-review.component';
import { ReportPaymentComponent } from './report-payment/report-payment.component';

@NgModule({
  declarations: [NewReportComponent, SubmittedReportsComponent, DraftReportsComponent, ReportDetailComponent, ReportReviewComponent, ReportPaymentComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
	SharedModule  
  ],
  providers: [SelectTariffTemplate, TariffsService, ReportApiServices, TariffDetailService ]	
})
export class ReportsModule { }
