import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewReportComponent } from './new-report/new-report.component';
import { SubmittedReportsComponent } from './submitted-reports/submitted-reports.component';
import { DraftReportsComponent } from './draft-reports/draft-reports.component';
import { ReportDetailComponent } from './report-detail/report-detail.component';
import { ReportReviewComponent } from './report-review/report-review.component';
import { ReportPaymentComponent } from './report-payment/report-payment.component';

import { CanDeactivateGuard } from '../_shared/services/protect.guard';

const routes: Routes = [
	{path:'new-report', component: NewReportComponent, canDeactivate: [CanDeactivateGuard], data : {reportId : null, reportType:null}},
	{path:'new-report/:id', component: NewReportComponent},
	{path:'submitted-reports', component: SubmittedReportsComponent},
	{path:'draft-reports', component: DraftReportsComponent},
	{path:'report-detail/:type/:id', component: ReportDetailComponent},
	{path:'report-review/:id', component: ReportReviewComponent},
	{path:'report-payment/:id', component: ReportPaymentComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
