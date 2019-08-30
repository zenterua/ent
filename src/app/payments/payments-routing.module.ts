import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MakePaymentComponent } from './make-payment/make-payment.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { PaymentDetailComponent } from './payment-detail/payment-detail.component';
import { PaymentSummaryComponent } from './make-payment/payment-summary/payment-summary.component';

const routes: Routes = [
	{ path: 'make-payment', component: MakePaymentComponent },
	{ path: 'payment-history', component: PaymentHistoryComponent },
	{ path: 'payment-detail/:id', component: PaymentDetailComponent },
	{ path: 'payment-summary/:id', component: PaymentSummaryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsRoutingModule { }
