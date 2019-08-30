import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ImpersonationHeaderService {
  impersonationSubject = new Subject<any>();
  constructor() {}
  impersonationStart(headerStatus: boolean): void {
    this.impersonationSubject.next(headerStatus);
  }
  watchImpersonationStart(): Observable<any> {
    return this.impersonationSubject.asObservable();
  }
}
