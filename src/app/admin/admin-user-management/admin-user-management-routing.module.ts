import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminUserDetailComponent} from './admin-user-detail/admin-user-detail.component';
import {AdminUserDashboardComponent} from './admin-user-dashboard/admin-user-dashboard.component';

const routes: Routes = [
	{path: '', component: AdminUserDashboardComponent},
	{path: 'user-detail/:id', component: AdminUserDetailComponent}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AdminUserManagementRoutingModule { }
