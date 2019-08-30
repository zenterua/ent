import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminImpersonationRoutingModule } from './admin-impersonation-routing.module';
import { AdminImpersonationDashboardComponent } from './admin-impersonation-dashboard/admin-impersonation-dashboard.component';
import {SharedModule} from '../../_shared/shared.module';
import {AdminImpersonationService} from './admin-impersonation.service';

@NgModule({
	declarations: [AdminImpersonationDashboardComponent],
	imports: [
		CommonModule,
		AdminImpersonationRoutingModule,
		SharedModule
	],
  providers: [AdminImpersonationService]
})
export class AdminImpersonationModule { }
