import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../_shared/shared.module';

import { StatementsRoutingModule } from './statements-routing.module';
import { StatementsComponent } from './statements.component';
import {StatementsService} from './statements.service';

@NgModule({
  declarations: [StatementsComponent],
  imports: [
    CommonModule,
    StatementsRoutingModule,
    SharedModule
  ],
  providers: [StatementsService]
})
export class StatementsModule { }
