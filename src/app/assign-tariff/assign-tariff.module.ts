import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../_shared/shared.module';
import { AssignTariffRoutingModule } from './assign-tariff-routing.module';
import { AssignTariffComponent } from './assign-tariff.component';
import { MatExpansionModule } from '@angular/material/expansion';

import { TariffsService } from './tariffs.service';

@NgModule({
  declarations: [AssignTariffComponent],
  imports: [
    CommonModule,
	SharedModule,  
    AssignTariffRoutingModule,
	MatExpansionModule  
  ],
  providers:[
	TariffsService
  ]
})
export class AssignTariffModule { }
