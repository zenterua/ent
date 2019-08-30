import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminAccountDetailComponent} from './admin-account-detail/admin-account-detail.component';
import {AdminAccountsDashboardComponent} from './admin-accounts-dashboard/admin-accounts-dashboard.component';

const routes: Routes = [
  {path: '', component: AdminAccountsDashboardComponent},
  {path: 'account-detail/:id', component: AdminAccountDetailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminAccountsRoutingModule { }
