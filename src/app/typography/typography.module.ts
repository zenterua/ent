import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../_shared/shared.module';

import { TypographyRoutingModule } from './typography-routing.module';
import { TypographyComponent } from './typography.component';

@NgModule({
  declarations: [TypographyComponent],
  imports: [
    CommonModule,
    TypographyRoutingModule,
	SharedModule  
  ]
})
export class TypographyModule { }
