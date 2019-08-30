import {NgModule} from '@angular/core';
import {AppTariffNamePipe} from './app-tariff-name.pipe';
import { AdminSelectTerritoriesComponent } from './admin-select-territories/admin-select-territories.component';
import {SharedModule} from '../../_shared/shared.module';

@NgModule({
  declarations: [AppTariffNamePipe, AdminSelectTerritoriesComponent],
  exports: [AppTariffNamePipe, AdminSelectTerritoriesComponent],
  imports: [SharedModule]
})
export class AdminSharedModule {}
