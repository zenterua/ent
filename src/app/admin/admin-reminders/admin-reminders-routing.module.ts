import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminRemindersDashboardComponent} from './admin-reminders-dashboard/admin-reminders-dashboard.component';
import {AdminReminderDetailComponent} from './admin-reminder-detail/admin-reminder-detail.component';
import { AdminCreateReminderComponent } from './admin-create-reminder/admin-create-reminder.component';

const routes: Routes = [
	{path: '', component: AdminRemindersDashboardComponent},
  {path: 'reminder-detail/:id', component: AdminReminderDetailComponent},
  {path: 'create-reminder', component: AdminCreateReminderComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRemindersRoutingModule { }
