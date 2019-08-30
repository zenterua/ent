import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminOwnersDashboardComponent} from './admin-owners-dashboard/admin-owners-dashboard.component';
import {AdminOwnerDetailComponent} from './admin-owner-detail/admin-owner-detail.component';

const routes: Routes = [
	{ path: '', component: AdminOwnersDashboardComponent},
	{ path: 'owner-detail/:id', component: AdminOwnerDetailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminOwnerAccountsRoutingModule { }
