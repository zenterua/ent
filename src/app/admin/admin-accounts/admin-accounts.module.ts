import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminAccountsRoutingModule } from './admin-accounts-routing.module';
import { AdminAccountsDashboardComponent } from './admin-accounts-dashboard/admin-accounts-dashboard.component';
import { AdminAccountDetailComponent } from './admin-account-detail/admin-account-detail.component';
import { SharedModule } from '../../_shared/shared.module';
import {AdminAccountsService} from './admin.accounts.service';
import { AdminCreateAccountComponent } from './admin-accounts-dashboard/admin-create-account/admin-create-account.component';
import { AdminEditAccountComponent } from './admin-accounts-dashboard/admin-edit-account/admin-edit-account.component';

@NgModule({
  declarations: [AdminAccountsDashboardComponent, AdminAccountDetailComponent, AdminCreateAccountComponent, AdminEditAccountComponent],
  imports: [
    CommonModule,
    AdminAccountsRoutingModule,
    SharedModule
  ],
  providers: [AdminAccountsService]
})
export class AdminAccountsModule { }
