import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminUserManagementRoutingModule } from './admin-user-management-routing.module';
import {SharedModule} from '../../_shared/shared.module';
import { AdminUserDetailComponent } from './admin-user-detail/admin-user-detail.component';
import { AdminUserDashboardComponent } from './admin-user-dashboard/admin-user-dashboard.component';
import {AdminUserManagementService} from './admin.user.management.service';

@NgModule({
	declarations: [AdminUserDetailComponent, AdminUserDashboardComponent],
	imports: [
	CommonModule,
		AdminUserManagementRoutingModule,
		SharedModule
	],
  providers: [
    AdminUserManagementService
  ]
})
export class AdminUserManagementModule { }
