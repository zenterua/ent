import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportCounterService {
    
	private number:any = new BehaviorSubject<number>(0);
	
  	currentNumber = this.number.asObservable();
	
    constructor(){}
    
	changeNumber(num:number) {
		this.number.next(num);
	}
}