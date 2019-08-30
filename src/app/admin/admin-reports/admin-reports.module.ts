import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminReportsRoutingModule } from './admin-reports-routing.module';
import { AdminReportsDashboardComponent } from './admin-reports-dashboard/admin-reports-dashboard.component';
import { AdminReportDetailComponent } from './admin-report-detail/admin-report-detail.component';
import {SharedModule} from '../../_shared/shared.module';
import {AdminReportsService} from './admin.reports.service';
import { AdminTariffDetail85bComponent } from './admin-report-detail/admin-tariff-detail85b/admin-tariff-detail85b.component';
import {AdminTemplateService} from './admin.template.service';
import {AdminReportDataService} from './admin.report.data.service';
import { AdminTariffDetail4a15jComponent } from './admin-report-detail/admin-tariff-detail4a15j/admin-tariff-detail4a15j.component';
import { AdminTariffDetail11B5iComponent } from './admin-report-detail/admin-tariff-detail11-b5i/admin-tariff-detail11-b5i.component';
import { AdminTariffDetail4b1Component } from './admin-report-detail/admin-tariff-detail4b1/admin-tariff-detail4b1.component';
import { AdminTariffDetail10a5gComponent } from './admin-report-detail/admin-tariff-detail10a5g/admin-tariff-detail10a5g.component';
import { AdminTariffDetail95hComponent } from './admin-report-detail/admin-tariff-detail95h/admin-tariff-detail95h.component';
import { AdminTariffDetail5bComponent } from './admin-report-detail/admin-tariff-detail5b/admin-tariff-detail5b.component';
import { AdminTariffDetail10b5fComponent } from './admin-report-detail/admin-tariff-detail10b5f/admin-tariff-detail10b5f.component';
import { AdminTariffDetail11a5eComponent } from './admin-report-detail/admin-tariff-detail11a5e/admin-tariff-detail11a5e.component';
import {AdminSharedModule} from '../admin-shared/admin-shared.module';

@NgModule({
  declarations: [
    AdminReportsDashboardComponent,
    AdminReportDetailComponent,
    AdminTariffDetail85bComponent,
    AdminTariffDetail4a15jComponent,
    AdminTariffDetail11B5iComponent,
    AdminTariffDetail4b1Component,
    AdminTariffDetail10a5gComponent,
    AdminTariffDetail95hComponent,
    AdminTariffDetail5bComponent,
    AdminTariffDetail10b5fComponent,
    AdminTariffDetail11a5eComponent],
  entryComponents: [
    AdminTariffDetail85bComponent,
    AdminTariffDetail4a15jComponent,
    AdminTariffDetail11B5iComponent,
    AdminTariffDetail4b1Component,
    AdminTariffDetail10a5gComponent,
    AdminTariffDetail95hComponent,
    AdminTariffDetail5bComponent,
    AdminTariffDetail10b5fComponent,
    AdminTariffDetail11a5eComponent],
  imports: [
    CommonModule,
    AdminReportsRoutingModule,
    SharedModule,
    AdminSharedModule
  ],
  exports: [AdminTariffDetail85bComponent],
  providers: [AdminReportsService, AdminTemplateService, AdminReportDataService]
})
export class AdminReportsModule { }
