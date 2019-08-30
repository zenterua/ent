import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { SharedModule } from '../_shared/shared.module';
import {AdminShareService} from './admin-shared/admin.share.service';
import {AdminHeaderService} from './admin-header/admin.header.service';
import {AdminAuthGuardService} from './admin-shared/admin.auth.guard.service';
import {AdminSharedModule} from './admin-shared/admin-shared.module';

@NgModule({
  declarations: [AdminHeaderComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    AdminSharedModule
  ],
  exports: [
    AdminHeaderComponent
  ],
  providers: [
    AdminHeaderService,
    AdminShareService,
    AdminAuthGuardService
  ]
})
export class AdminModule { }
