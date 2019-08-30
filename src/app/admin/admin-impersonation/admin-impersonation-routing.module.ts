import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminImpersonationDashboardComponent} from './admin-impersonation-dashboard/admin-impersonation-dashboard.component';

const routes: Routes = [
		{path: '', component: AdminImpersonationDashboardComponent}
	];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminImpersonationRoutingModule { }
