import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../_shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TariffDetailService } from './tariff.detail.service';

import { Tariff85bComponent } from '../tariffs/tariff8-5b/tariff8-5b.component';
import { Tariff10A5GComponent } from './tariff10-a5-g/tariff10-a5-g.component';
import { Tariff11B5IComponent } from './tariff11-b5-i/tariff11-b5-i.component';
import { Tariff4A15JComponent } from './tariff4-a15-j/tariff4-a15-j.component';
import { Tariff4B1Component } from './tariff4-b1/tariff4-b1.component';
import { Tariff95hComponent } from './tariff9-5h/tariff9-5h.component';
import { Tariff5bComponent } from './tariff5b/tariff5b.component';
import { Tariff11A5EComponent } from './tariff11-a5-e/tariff11-a5-e.component';
import { Tariff10B5FComponent } from './tariff10-b5-f/tariff10-b5-f.component';

@NgModule({
  declarations: [Tariff85bComponent, Tariff10A5GComponent, Tariff11B5IComponent, Tariff4A15JComponent, Tariff4B1Component, Tariff95hComponent, Tariff5bComponent, Tariff11A5EComponent, Tariff10B5FComponent, Tariff10B5FComponent],
  imports: [
    CommonModule,
	SharedModule,
	BrowserAnimationsModule  
  ], 
//  exports:[Tariff85bComponent, Tariff10A5GComponent, Tariff11B5IComponent, Tariff4A15JComponent, Tariff4B1Component, Tariff95hComponent, Tariff5bComponent, Tariff11A5EComponent, Tariff10B5FComponent],
  entryComponents: [Tariff85bComponent, Tariff10A5GComponent, Tariff11B5IComponent, Tariff4A15JComponent, Tariff4B1Component, Tariff95hComponent, Tariff5bComponent, Tariff11A5EComponent, Tariff10B5FComponent],
  providers:[TariffDetailService ]	
})
export class TariffsModule { }
