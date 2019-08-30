import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../_shared/shared.module';

import { InvoicesRoutingModule } from './invoices-routing.module';
import { InvoicesComponent } from './invoices.component';

@NgModule({
  declarations: [InvoicesComponent],
  imports: [
    CommonModule,
    InvoicesRoutingModule,
	SharedModule  
  ]
})
export class InvoicesModule { }
