import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../_shared/shared.module';

import { PaymentsRoutingModule } from './payments-routing.module';
import { MakePaymentComponent } from './make-payment/make-payment.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { PaymentDetailComponent } from './payment-detail/payment-detail.component';
import { CardDetailTypeComponent } from './payment-detail/card-detail-type/card-detail-type.component';
import { PaymentSummaryComponent } from './make-payment/payment-summary/payment-summary.component';

@NgModule({
  declarations: [MakePaymentComponent, PaymentHistoryComponent, PaymentDetailComponent, CardDetailTypeComponent, PaymentSummaryComponent],
  imports: [
    CommonModule,
    PaymentsRoutingModule,
	SharedModule  
  ]
})
export class PaymentsModule { }
