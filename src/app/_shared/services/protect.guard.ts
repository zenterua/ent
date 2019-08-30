import { Injectable }           from '@angular/core';
import { Observable }           from 'rxjs';
import { CanDeactivate,
         ActivatedRouteSnapshot,
         RouterStateSnapshot }  from '@angular/router';

import { NewReportComponent } from '../../reports/new-report/new-report.component';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<NewReportComponent> {

  canDeactivate(
    component: NewReportComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {

		if (!component.canDeactivateService.data.value){
			return !component.canDeactivateService.data.value;
		}else{
			return component.dialogService.confirm('Discard changes?');
		}
  }
}