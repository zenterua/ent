import { Component, OnInit } from '@angular/core';
import { AdminReportDataService } from '../../admin.report.data.service';

@Component({
  selector: 'app-admin-tariff-detail11-b5i',
  templateUrl: './admin-tariff-detail11-b5i.component.html',
  styleUrls: ['./admin-tariff-detail11-b5i.component.scss']
})
export class AdminTariffDetail11B5iComponent implements OnInit {
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
  calcFees(){
	  if (this.reportsArr.length == 2 && this.reportsArr[0].AMT_TO_BILL == 0 && this.reportsArr[1].AMT_TO_BILL == 0){
		  this.zeroReport = true;
	  }else{
		  this.zeroReport = false;
		  this.reportsArr.forEach((item)=>{
			   if (item.COMPANY == 'SOCAN'){
					this.sortedArr.push({
						EVENT_NAME: item.VENUE,
						ESTABLISHMENT: item.CITY,
						PERFORMER_NAME: item.PERFORMER,
						PROMOTER_NAME: item.PROMOTER,
						PROMOTER_ADDRESS: item.PROMOTER_ADDRESS,
						PROMOTER_PROVINCE: item.PROMOTER_PROVINCE,
						PROMOTER_CITY: item.PROMOTER_CITY,
						PROMOTER_POSTAL: item.PROMOTER_POSTAL,
						DATE: item.DATE_OF_EVENT,
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
