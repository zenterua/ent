import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminPaymentHistoryRoutingModule } from './admin-payment-history-routing.module';
import { AdminPaymentHistoryDashboardComponent } from './admin-payment-history-dashboard/admin-payment-history-dashboard.component';
import {SharedModule} from '../../_shared/shared.module';
import {AdminPaymentService} from './admin-payment.service';

@NgModule({
	declarations: [AdminPaymentHistoryDashboardComponent],
	imports: [
		CommonModule,
		AdminPaymentHistoryRoutingModule,
		SharedModule
	],
  providers: [AdminPaymentService]
})
export class AdminPaymentHistoryModule { }
