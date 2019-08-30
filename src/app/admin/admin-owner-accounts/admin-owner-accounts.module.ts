import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminOwnerAccountsRoutingModule } from './admin-owner-accounts-routing.module';
import { AdminOwnersDashboardComponent } from './admin-owners-dashboard/admin-owners-dashboard.component';
import { AdminOwnerDetailComponent } from './admin-owner-detail/admin-owner-detail.component';
import {SharedModule} from '../../_shared/shared.module';
import { AdminOwnersService } from './admin.owners.service';
import { AdminOwnerEditInfoComponent } from './admin-owner-detail/admin-owner-edit-info/admin-owner-edit-info.component';
import { AdminOwnerCreateAccountComponent } from './admin-owners-dashboard/admin-owner-create-account/admin-owner-create-account.component';
import { AdminOwnerAssignLicenseesComponent } from './admin-owner-assign-licensees/admin-owner-assign-licensees.component';

@NgModule({
  declarations: [AdminOwnersDashboardComponent, AdminOwnerDetailComponent, AdminOwnerEditInfoComponent, AdminOwnerCreateAccountComponent, AdminOwnerAssignLicenseesComponent],
  entryComponents: [AdminOwnerEditInfoComponent],
  imports: [
	  CommonModule,
	  AdminOwnerAccountsRoutingModule,
	  SharedModule
  ],
  exports: [AdminOwnerEditInfoComponent],
  providers: [AdminOwnersService]
})
export class AdminOwnerAccountsModule { }
