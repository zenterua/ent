import { Component, OnInit } from '@angular/core';
import {AdminReportDataService} from '../../admin.report.data.service';

@Component({
  selector: 'app-admin-tariff-detail85b',
  templateUrl: './admin-tariff-detail85b.component.html'
})
export class AdminTariffDetail85bComponent implements OnInit {
  reportData: any[];
  eventRooms = [];
  quarter: string;
  reportYear: string;
  socanFees = 0;
  resoundFees = 0;
  hstFees = 0;
  totalFees = 0;
  constructor(private adminDataService: AdminReportDataService) { }

  ngOnInit() {
    this.adminDataService.getReportData().subscribe((data: any) => {
      this.reportData = data;
      this.reportYear = data[0].VALID_YEAR;
      this.setQuarter(data[0].VALID_MONTH);
      this.calcFees();
    });
  }
  setQuarter(quarter) {
    switch (quarter) {
      case 'Q1': this.quarter = '1st Quarter (Jan to Mar)'; break;
      case 'Q2': this.quarter = '2nd Quarter (Apr to Jun)'; break;
      case 'Q3': this.quarter = '3rd Quarter (Jul to Sep)'; break;
      case 'Q4': this.quarter = '4th Quarter (Oct to Dec)'; break;
      default: break;
    }
  }
  calcFees() {
    for ( const i of this.reportData) {
      if ( i.COMPANY === 'SOCAN') {
        this.socanFees += i.AMT_TO_BILL;
        this.eventRooms.push({
          ROOM_CAPACITY: i.ROOM_CAPACITY,
          NON_DANCE_EVENTS: i.NON_DANCE_EVENTS,
          DANCE_EVENTS: i.DANCE_EVENTS,
          ROOM_CAPACITY_NAME: this.roomCapacity(i.ROOM_CAPACITY)
        });
      } else if ( i.COMPANY === 'RESOUND' ) {
        this.resoundFees += i.AMT_TO_BILL;
      }
      this.hstFees += i.PST_AMT + i.GST_AMT + i.HST_AMT;
      this.totalFees += i.TRANS_AMT;
    }
  }
  roomCapacity(room) {
    switch (room) {
      case '100': return '1-100'; break;
      case '300': return '101-300'; break;
      case '500': return '301-500'; break;
      case '999999': return 'Over 500'; break;
      default: break;
    }
  }

}
