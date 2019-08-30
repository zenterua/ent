import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserDataService {
    
	private data:any = new BehaviorSubject<any>({});
	
  	currentData = this.data.asObservable();
	
    constructor(){}
    
	changeData(status:any) {
		this.data.next(status)
	}
}