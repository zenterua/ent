import { Component, ComponentFactoryResolver, Injectable, Inject, ReflectiveInjector } from '@angular/core'
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

@Injectable()
export class DetailReportTemplate {
	rootViewContainer: any;

	constructor(private factoryResolver: ComponentFactoryResolver) { }

	setRootViewContainerRef(viewContainerRef) {
		this.rootViewContainer = viewContainerRef
	}

	addDynamicComponent(num: any, type: any, company?: any) {
		let factory;
		if (num == 'SCE 8' || num == '80' || num == 'RSE 5B') {
			let review85b: any = Template85bComponent;
			let detail85b: any = Detail85bComponent;
			factory = this.factoryResolver.resolveComponentFactory(type == 'review' ? review85b : detail85b);
		}
		if (num == 'SCE 10A' || num == '100' || num == 'RSE 5G') {
			let review10a5g: any = Template10a5gComponent;
			let detail10a5g: any = Detail10a5gComponent;
			factory = this.factoryResolver.resolveComponentFactory(type == 'review' ? review10a5g : detail10a5g);
		}
		if (num == 'SCE 11B' || num == '111' || num == 'RSE 5I') {
			let review11b5i: any = Template11b5iComponent;
			let detail11b5i: any = Detail11b5iComponent;
			factory = this.factoryResolver.resolveComponentFactory(type == 'review' ? review11b5i : detail11b5i);
		}
		if (num == 'SCE 4A1' || num == '40' || num == 'RSE 5J') {
			let review4a15j: any = Template4a15jComponent;
			let detail4a15j: any = Detail4a15jComponent;
			factory = this.factoryResolver.resolveComponentFactory(type == 'review' ? review4a15j : detail4a15j);
		}
		if (num == 'SCE 4B1' || num == '41') {
			let review4b1: any = Template4b1Component;
			let detail4b1: any = Detail4b1Component;
			factory = this.factoryResolver.resolveComponentFactory(type == 'review' ? review4b1 : detail4b1);
		}
		if (num == 'SCE 9' || num == '90' || num == 'RSE 5H') {
			let review95h: any = Template95hComponent;
			let detail95h: any = Detail95hComponent;
			factory = this.factoryResolver.resolveComponentFactory(type == 'review' ? review95h : detail95h);
		}
		if (num == 'SCE 5B' || num == '51') {
			let review5b: any = Template5bComponent;
			let detail5b: any = Detail5bComponent;
			factory = this.factoryResolver.resolveComponentFactory(type == 'review' ? review5b : detail5b);
		}
		if (num == 'SCE 11A' || num == '110' || num == 'RSE 5E') {
			let review11a5e: any = Template11a5eComponent;
			let detail11a5e: any = Detail11a5eComponent;
			factory = this.factoryResolver.resolveComponentFactory(type == 'review' ? review11a5e : detail11a5e);
		}
		if (num == 'SCE 10B' || num == '101' || num == 'RSE 5F') {
			let review10b5f: any = Template10b5fComponent;
			let detail10b5f: any = Detail10b5fComponent;
			factory = this.factoryResolver.resolveComponentFactory(type == 'review' ? review10b5f : detail10b5f);
		}

		const component = factory.create(this.rootViewContainer.parentInjector);
		this.rootViewContainer.insert(component.hostView);
	}
}
