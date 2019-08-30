import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssignTariffComponent } from './assign-tariff.component';

const routes: Routes = [{
	path: '', component: AssignTariffComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignTariffRoutingModule { }
