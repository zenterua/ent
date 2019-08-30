import {ComponentFactoryResolver, Injectable} from '@angular/core';
import {AdminTariffDetail85bComponent} from './admin-report-detail/admin-tariff-detail85b/admin-tariff-detail85b.component';
import {AdminTariffDetail4a15jComponent} from './admin-report-detail/admin-tariff-detail4a15j/admin-tariff-detail4a15j.component';
import { AdminTariffDetail11B5iComponent } from './admin-report-detail/admin-tariff-detail11-b5i/admin-tariff-detail11-b5i.component';
import { AdminTariffDetail4b1Component } from './admin-report-detail/admin-tariff-detail4b1/admin-tariff-detail4b1.component';
import { AdminTariffDetail10a5gComponent } from './admin-report-detail/admin-tariff-detail10a5g/admin-tariff-detail10a5g.component';
import { AdminTariffDetail95hComponent } from './admin-report-detail/admin-tariff-detail95h/admin-tariff-detail95h.component';
import { AdminTariffDetail5bComponent } from './admin-report-detail/admin-tariff-detail5b/admin-tariff-detail5b.component';
import { AdminTariffDetail10b5fComponent } from './admin-report-detail/admin-tariff-detail10b5f/admin-tariff-detail10b5f.component';
import { AdminTariffDetail11a5eComponent } from './admin-report-detail/admin-tariff-detail11a5e/admin-tariff-detail11a5e.component';

@Injectable()
export class AdminTemplateService {
  rootViewContainer: any;
  constructor(private factoryResolver: ComponentFactoryResolver) {}
  setViewContainer(viewContainer) {
    this.rootViewContainer = viewContainer;
  }
  addDynamicComponent(tariffName: string) {
    let factory;
    if ( tariffName === 'SCE 4A1' ) {
      factory = this.factoryResolver.resolveComponentFactory(AdminTariffDetail4a15jComponent);
    }
    if ( tariffName === 'SCE 8' || tariffName === 'RSE 5B') {
      factory = this.factoryResolver.resolveComponentFactory(AdminTariffDetail85bComponent);
    }
    if ( tariffName === 'SCE 5B') {
      factory = this.factoryResolver.resolveComponentFactory(AdminTariffDetail5bComponent);
    }
    if ( tariffName === 'SCE 11B') {
      factory = this.factoryResolver.resolveComponentFactory(AdminTariffDetail11B5iComponent);
    }
    if ( tariffName === 'SCE 4B1' || tariffName === '4B1') {
      factory = this.factoryResolver.resolveComponentFactory(AdminTariffDetail4b1Component);
    }
    if ( tariffName === 'SCE 10A') {
      factory = this.factoryResolver.resolveComponentFactory(AdminTariffDetail10a5gComponent);
    }
    if ( tariffName === 'SCE 9') {
      factory = this.factoryResolver.resolveComponentFactory(AdminTariffDetail95hComponent);
    }
    if ( tariffName === 'SCE 10B' || tariffName === 'RSE 5F') {
      factory = this.factoryResolver.resolveComponentFactory(AdminTariffDetail10b5fComponent);
    }
    if ( tariffName === 'SCE 11A' || tariffName === 'RSE 5E') {
      factory = this.factoryResolver.resolveComponentFactory(AdminTariffDetail11a5eComponent);
    }


    const component = factory.create(this.rootViewContainer.parentInjector);
    this.rootViewContainer.insert(component.hostView);
  }
}
