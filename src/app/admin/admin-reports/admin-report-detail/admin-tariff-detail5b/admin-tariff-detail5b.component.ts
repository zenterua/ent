import { Component, OnInit } from '@angular/core';
import { AdminReportDataService } from '../../admin.report.data.service';

@Component({
  selector: 'app-admin-tariff-detail5b',
  templateUrl: './admin-tariff-detail5b.component.html'
})
export class AdminTariffDetail5bComponent implements OnInit {
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
  province:any;
  constructor(private adminDataService: AdminReportDataService) { }

  ngOnInit() {
    this.adminDataService.getReportData()
		  .subscribe((data) => {
		  this.reportsArr = [...data];
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
						CONCERT_ACT: item.PERFORMER,
						PROMOTER_NAME: item.PROMOTER,
						DATE: item.DATE_OF_EVENT,
						GROSS: item.FEES_PAID_TO_PERFORMERS,
						GROSS_ADULT: item.GROSS_RECEIPTS
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

}
