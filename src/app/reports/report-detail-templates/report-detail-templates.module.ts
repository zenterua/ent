import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../_shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DetailReportTemplate } from './report.template.service';
import { ReportApiServices } from '../report.api.services';

import { Template10a5gComponent } from './review/template10a5g/template10a5g.component';
import { Template85bComponent } from './review/template85b/template85b.component';
import { Template11b5iComponent } from './review/template11b5i/template11b5i.component';
import { Template4a15jComponent } from './review/template4a15j/template4a15j.component';
import { Template4b1Component } from './review/template4b1/template4b1.component';
import { Template95hComponent } from './review/template95h/template95h.component';
import { Template5bComponent } from './review/template5b/template5b.component';
import { Template11a5eComponent } from './review/template11a5e/template11a5e.component';
import { Template10b5fComponent } from './review/template10b5f/template10b5f.component';

import { Detail10a5gComponent } from './detail/detail10a5g/detail10a5g.component';
import { Detail85bComponent } from './detail/detail85b/detail85b.component';
import { Detail11b5iComponent } from './detail/detail11b5i/detail11b5i.component';
import { Detail4a15jComponent } from './detail/detail4a15j/detail4a15j.component';
import { Detail4b1Component } from './detail/detail4b1/detail4b1.component';
import { Detail95hComponent } from './detail/detail95h/detail95h.component';
import { Detail5bComponent } from './detail/detail5b/detail5b.component';
import { Detail11a5eComponent } from './detail/detail11a5e/detail11a5e.component';
import { Detail10b5fComponent } from './detail/detail10b5f/detail10b5f.component';

@NgModule({
  declarations: [Template10a5gComponent, Template85bComponent, Detail10a5gComponent, Detail85bComponent, Template11b5iComponent, Detail11b5iComponent, Detail4a15jComponent, Template4a15jComponent, Detail4b1Component, Template4b1Component, Detail95hComponent, Template95hComponent, Template5bComponent, Template5bComponent, Detail5bComponent, Template11a5eComponent, Detail11a5eComponent, Template10b5fComponent, Detail10b5fComponent],
  imports: [
    CommonModule,
    SharedModule,
    BrowserAnimationsModule
  ],
  entryComponents: [Template10a5gComponent, Template85bComponent, Detail10a5gComponent, Detail85bComponent, Template11b5iComponent, Detail11b5iComponent, Template4a15jComponent, Detail4a15jComponent, Detail4b1Component, Template4b1Component, Template95hComponent, Detail95hComponent, Template5bComponent, Detail5bComponent, Template11a5eComponent, Detail11a5eComponent, Template10b5fComponent, Detail10b5fComponent],
  providers: [DetailReportTemplate, ReportApiServices]
})
export class ReportDetailTemplatesModule { }
