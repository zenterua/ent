import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable()
export class AdminReportDataService {
  private reportData = new BehaviorSubject<any>({});
  constructor() {}
  sendReportData(data): void {
    this.reportData.next(data);
  }
  getReportData(): Observable<any> {
    return this.reportData.asObservable();
  }
}
