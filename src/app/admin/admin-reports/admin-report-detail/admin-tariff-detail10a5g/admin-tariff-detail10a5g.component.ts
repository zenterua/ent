import { Component, OnInit } from '@angular/core';
import { AdminReportDataService } from '../../admin.report.data.service';

@Component({
  selector: 'app-admin-tariff-detail10a5g',
  templateUrl: './admin-tariff-detail10a5g.component.html',
  styleUrls: ['./admin-tariff-detail10a5g.component.scss']
})
export class AdminTariffDetail10a5gComponent implements OnInit {
  socanFees:number = 0;
  resoundFees:number = 0;

  hstFees:number = 0;
  pstFees:number = 0;
  gstFees:number = 0;
  totalFees:number = 0;
  hstTaxCode:boolean;
  pstTaxCode:boolean;
  gstTaxCode:boolean;
  province:any;
  reportsArr:any[] = [];
  sortedArr:any[] = [];
  zeroReport:boolean;

  constructor(private adminDataService: AdminReportDataService) { }

  ngOnInit() {
    this.adminDataService.getReportData()
		.subscribe((value: any) => {
			this.reportsArr = [...value];
			if (value[0].EVENT_PROV_POSTAL){
			this.province = value[0].EVENT_PROV_POSTAL.substring(0, 2)
				}
			if (value[0].PST_AMT>0){
			this.pstTaxCode = true;
			}
			if (value[0].HST_AMT>0){
			this.hstTaxCode = true;
			}
			if (value[0].GST_AMT>0){
			this.gstTaxCode = true;
			}
			this.calcFees();
		});
  }

  setDays(end:any, start:any){
    let resultDays:any;
    let startDay:any = new Date(start);
    let endDay:any = new Date(end);
  return resultDays = (endDay - startDay)/(1000*60*60*24) + 1;
}

calcFees(){
  if (this.reportsArr.length == 2 && this.reportsArr[0].AMT_TO_BILL == 0 && this.reportsArr[1].AMT_TO_BILL == 0){
    this.zeroReport = true;
  }else{
    this.zeroReport = false;
     let groupArr = [];
     let resStatus;
     const groupedCollectionStatus = this.reportsArr.reduce((previous, current)=> {
      if(!previous[current['SEQ_NO']]) {
        previous[current['SEQ_NO']] = [current];
      } else {
        previous[current['SEQ_NO']].push(current);
      }
       return previous;
    },{});
    resStatus = Object.keys(groupedCollectionStatus).map(key=>({ SEQ_NO: key, reports: groupedCollectionStatus[key]}));
    groupArr = [...resStatus];
    groupArr.forEach((i)=>{
      let isLive;
      if (i.reports.length == 2){isLive = 0;
      }else{isLive = 1;}
      this.sortedArr.push({
        EVENT_NAME: i.reports[0].EVENT_NAME,
        START_DATE: i.reports[0].START_DATE,
        END_DATE: i.reports[0].STOP_DATE,
        LIVE_ONLY: isLive,
        DAYS:this.setDays(i.reports[0].STOP_DATE, i.reports[0].START_DATE)
      });
     });
         this.calcValues();
  }
}

calcValues(){
  this.reportsArr.forEach((x)=>{
  if (x.COMPANY == 'SOCAN'){
    this.socanFees += x.AMT_TO_BILL;
  }
  if (x.COMPANY == 'RESOUND'){
    this.resoundFees += x.AMT_TO_BILL;
  }
  this.hstFees += x.HST_AMT;
  this.pstFees += x.PST_AMT;
  this.gstFees += x.GST_AMT;
  this.totalFees += x.TRANS_AMT;
  });
}

}
