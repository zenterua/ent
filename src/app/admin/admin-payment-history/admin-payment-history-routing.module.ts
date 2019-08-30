import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminPaymentHistoryDashboardComponent} from './admin-payment-history-dashboard/admin-payment-history-dashboard.component';

const routes: Routes = [
	{path: '', component: AdminPaymentHistoryDashboardComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminPaymentHistoryRoutingModule { }
