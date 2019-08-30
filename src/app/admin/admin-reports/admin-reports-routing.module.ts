import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminReportsDashboardComponent} from './admin-reports-dashboard/admin-reports-dashboard.component';
import {AdminReportDetailComponent} from './admin-report-detail/admin-report-detail.component';

const routes: Routes = [
	{path: '', component: AdminReportsDashboardComponent},
	{path: 'report-detail/:type/:id', component: AdminReportDetailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminReportsRoutingModule { }
