import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../_shared/shared.module';
import { SupportRoutingModule } from './support-routing.module';
import { SupportComponent } from './support.component';

@NgModule({
  declarations: [SupportComponent],
  imports: [
    CommonModule,
    SupportRoutingModule,
	SharedModule  
  ]
})
export class SupportModule { }
