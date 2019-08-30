import { Component, ComponentFactoryResolver, Injectable, Inject, ReflectiveInjector} from '@angular/core'
import { Tariff85bComponent } from '../../tariffs/tariff8-5b/tariff8-5b.component';
import { Tariff10A5GComponent } from '../../tariffs/tariff10-a5-g/tariff10-a5-g.component';
import { Tariff11B5IComponent } from '../../tariffs/tariff11-b5-i/tariff11-b5-i.component';
import { Tariff4A15JComponent } from '../../tariffs/tariff4-a15-j/tariff4-a15-j.component';
import { Tariff4B1Component } from '../../tariffs/tariff4-b1/tariff4-b1.component';
import { Tariff95hComponent } from '../../tariffs/tariff9-5h/tariff9-5h.component';
import { Tariff5bComponent } from '../../tariffs/tariff5b/tariff5b.component';
import { Tariff11A5EComponent } from '../../tariffs/tariff11-a5-e/tariff11-a5-e.component';
import { Tariff10B5FComponent } from '../../tariffs/tariff10-b5-f/tariff10-b5-f.component';

@Injectable()
export class SelectTariffTemplate {
  rootViewContainer:any;	
	
  constructor(private factoryResolver: ComponentFactoryResolver) {}

  setRootViewContainerRef(viewContainerRef) {
    this.rootViewContainer = viewContainerRef
  }
	
  clearRootViewContainerRef(viewContainerRef) {
    this.rootViewContainer = null
  }	

  addDynamicComponent(num:any) {
	let factory = null;  
	if (num == 'SCE 8' || num == '80' || num == 'RSE 5B'){
		factory = this.factoryResolver.resolveComponentFactory(Tariff85bComponent)
	} 
	  
	if (num == 'SCE 10A' || num == '100' || num == 'RSE 5G'){
		factory = this.factoryResolver.resolveComponentFactory(Tariff10A5GComponent)
	}
	  
	if (num == 'SCE 11B' || num == '111' || num == 'RSE 5I'){
		factory = this.factoryResolver.resolveComponentFactory(Tariff11B5IComponent)
	}
	  
	if (num == 'SCE 4A1' || num == '40' || num == 'RSE 5J'){
		factory = this.factoryResolver.resolveComponentFactory(Tariff4A15JComponent)
	} 
	  
	if (num == 'SCE 4B1' || num == '41'){
		factory = this.factoryResolver.resolveComponentFactory(Tariff4B1Component)
	}
	  
	if (num == 'SCE 9' || num == '90' || num == 'RSE 5H'){
		factory = this.factoryResolver.resolveComponentFactory(Tariff95hComponent)
	}
	  
	if (num == 'SCE 5B' || num == '51'){
		factory = this.factoryResolver.resolveComponentFactory(Tariff5bComponent)
	} 
	  
	if (num == 'SCE 11A' || num == '110' || num == 'RSE 5E'){
		factory = this.factoryResolver.resolveComponentFactory(Tariff11A5EComponent)
	} 

	if (num == 'SCE 10B' || num == '101' || num == 'RSE 5F'){
		factory = this.factoryResolver.resolveComponentFactory(Tariff10B5FComponent)
	}  

    const component = factory.create(this.rootViewContainer.parentInjector)
    this.rootViewContainer.insert(component.hostView)
  }
}