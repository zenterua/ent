import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRemindersRoutingModule } from './admin-reminders-routing.module';
import { AdminRemindersDashboardComponent } from './admin-reminders-dashboard/admin-reminders-dashboard.component';
import {SharedModule} from '../../_shared/shared.module';
import { AdminReminderDetailComponent } from './admin-reminder-detail/admin-reminder-detail.component';
import { AdminCreateReminderComponent } from './admin-create-reminder/admin-create-reminder.component';
import {AdminReminderService} from './admin-reminder.service';
import { AdminReminderTariffsComponent } from './admin-reminder-tariffs/admin-reminder-tariffs.component';
import {AdminSharedModule} from '../admin-shared/admin-shared.module';

@NgModule({
  declarations: [
    AdminRemindersDashboardComponent,
    AdminReminderDetailComponent,
    AdminCreateReminderComponent,
    AdminReminderTariffsComponent
  ],
  imports: [
    CommonModule,
    AdminRemindersRoutingModule,
    SharedModule,
    AdminSharedModule
  ],
  providers: [AdminReminderService]
})
export class AdminRemindersModule { }
