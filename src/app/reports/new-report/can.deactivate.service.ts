import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CanDeactivateService {
    
	public data:any = new BehaviorSubject<boolean>(false);
	
  	currentStatus = this.data.asObservable();
	
    constructor(){}
    
	changeStatus(status:any) {
		this.data.next(status)
	}
}