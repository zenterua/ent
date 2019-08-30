import { Component, OnInit } from '@angular/core';
import { AdminReportDataService } from '../../admin.report.data.service';

@Component({
  selector: 'app-admin-tariff-detail95h',
  templateUrl: './admin-tariff-detail95h.component.html',
  styleUrls: ['./admin-tariff-detail95h.component.scss']
})
export class AdminTariffDetail95hComponent implements OnInit {
  socanFees:number = 0;
  resoundFees:number = 0;

  hstFees:number = 0;
  pstFees:number = 0;
  gstFees:number = 0;
  totalFees:number = 0;
  hstTaxCode:boolean;
  pstTaxCode:boolean;
  gstTaxCode:boolean;
  reportsArr:any[] = [];
  sortedArr:any[] = [];
  zeroReport:boolean;
  quarter:string;
  province:any;

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
      this.setQuarter(value[0].VALID_MONTH);
			this.calcFees();
		});
  }

  calcFees(){
	  if (this.reportsArr.length == 2 && this.reportsArr[0].AMT_TO_BILL == 0 && this.reportsArr[1].AMT_TO_BILL == 0){
		  this.zeroReport = true;
	  }else{
		  this.zeroReport = false;
		  this.reportsArr.forEach((item)=>{
			   if (item.COMPANY == 'SOCAN'){
					this.sortedArr.push({
						EVENT_NAME: item.NAME_OF_EVENT,
						VENUE_NAME: item.VENUE,
						DATE: item.DATE_OF_EVENT,
						IS_FREE: item.GROSS_RECEIPTS ? 0 : 1,
						GROSS: item.GROSS_RECEIPTS
					});
				}
		   });
		   this.calcValues();
	  }
  }

  calcValues(){
	  let totalSc = 0;
	  let totalRs = 0;
	  let hstSc = 0;
	  let pstSc = 0;
	  let gstSc = 0;
	  let hstRs = 0;
	  let pstRs = 0;
	  let gstRs = 0;
	  this.reportsArr.forEach((x)=>{
		  if (x.COMPANY == 'SOCAN'){
			  this.socanFees = x.AMT_TO_BILL;
			  totalSc = x.TRANS_AMT;
			  hstSc = x.HST_AMT;
			  pstSc = x.PST_AMT;
			  gstSc = x.GST_AMT;
		  }
		  if (x.COMPANY == 'RESOUND'){
			  this.resoundFees = x.AMT_TO_BILL;
			  totalRs = x.TRANS_AMT;
			  hstRs = x.HST_AMT;
			  pstRs = x.PST_AMT;
			  gstRs = x.GST_AMT;
		  }
		  this.hstFees = hstSc + hstRs;
		  this.pstFees = pstSc + pstRs;
		  this.gstFees = gstSc + gstRs;
		  this.totalFees = totalSc + totalRs;
	  });
  }

  setQuarter(quarter){
    switch (quarter){
      case 'Q1': this.quarter = '1st Quarter (Jan to Mar)';
      break;
      case 'Q2': this.quarter = '2nd Quarter (Apr to Jun)';
      break;
      case 'Q3': this.quarter = '3rd Quarter (Jul to Sept)';
      break;
      case 'Q4': this.quarter = '4th Quarter (Oct to Dec)';
      break;
      default:
          break;
    }
  }

}
