import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { SnackBarComponent } from '../_shared/components/snack-bar/snack-bar.component';
import { emailPattern } from '../_shared/validators/email.validator';
import {trigger} from '@angular/animations';
import {animationPopup} from '../_shared/animations';

@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  animations: [trigger('animationPopup', animationPopup)]
})
export class TypographyComponent implements OnInit {
  private paginator: MatPaginator;
  private sort: MatSort;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  simpleForm:FormGroup;
  infoUsPopup:boolean;
  value:string;
  tab:any = 1;

  dataPayments:any = [
	  {
		  date:new Date(),
          time:'09:05 AM',
		  payNumber:'87649589',
		  paidBy:'Elizabeth Blackburn',
		  type:'Credit Card',
		  amount:'1032.05',
		  status:'Successful'
	  },
	  {
		  date:new Date(1549447678),
          time:'10:05 AM',
		  payNumber:'87649589',
		  paidBy:'Edmond Halley',
		  type:'Credit Card',
		  amount:'250.00',
		  status:'Successful'
	  },
	  {
		  date:new Date(1551002933),
          time:'02:05 AM',
		  payNumber:'87649589',
		  paidBy:'Elizabeth Blackburn',
		  type:'Offline',
		  amount:'55.05',
		  status:'Unsuccessful'
	  },
	  {
		  date:new Date(),
          time:'10:05 AM',
		  payNumber:'87649589',
		  paidBy:'Elizabeth Blackburn',
		  type:'Credit Card',
		  amount:'87.05',
		  status:'Successful'
	  }
  ];

   dataPayments2:any = [
	  {
		  date:new Date(),
          time:'09:05 AM',
		  payNumber:'87649589',
		  paidBy:'Elizabeth Blackburn',
		  type:'Credit Card',
		  amount:'1032.05',
		  status:'Successful'
	  },
	  {
		  date:new Date(1549447678),
          time:'10:05 AM',
		  payNumber:'87649589',
		  paidBy:'Edmond Halley',
		  type:'Credit Card',
		  amount:'250.00',
		  status:'Successful'
	  },
	  {
		  date:new Date(1551002933),
          time:'02:05 AM',
		  payNumber:'87649589',
		  paidBy:'Elizabeth Blackburn',
		  type:'Offline',
		  amount:'55.05',
		  status:'Unsuccessful'
	  },
	  {
		  date:new Date(),
          time:'10:05 AM',
		  payNumber:'87649589',
		  paidBy:'Elizabeth Blackburn',
		  type:'Credit Card',
		  amount:'87.05',
		  status:'Successful'
	  },
	  {
		  date:new Date(),
          time:'09:05 AM',
		  payNumber:'87649589',
		  paidBy:'Elizabeth Blackburn',
		  type:'Credit Card',
		  amount:'1032.05',
		  status:'Successful'
	  },
	  {
		  date:new Date(1549447678),
          time:'10:05 AM',
		  payNumber:'87649589',
		  paidBy:'Edmond Halley',
		  type:'Credit Card',
		  amount:'250.00',
		  status:'Successful'
	  },
	  {
		  date:new Date(1551002933),
          time:'02:05 AM',
		  payNumber:'87649589',
		  paidBy:'Elizabeth Blackburn',
		  type:'Offline',
		  amount:'55.05',
		  status:'Unsuccessful'
	  },
	  {
		  date:new Date(),
          time:'10:05 AM',
		  payNumber:'87649589',
		  paidBy:'Elizabeth Blackburn',
		  type:'Credit Card',
		  amount:'87.05',
		  status:'Successful'
	  },
	  {
		  date:new Date(),
          time:'09:05 AM',
		  payNumber:'87649589',
		  paidBy:'Elizabeth Blackburn',
		  type:'Credit Card',
		  amount:'1032.05',
		  status:'Successful'
	  },
	  {
		  date:new Date(1549447678),
          time:'10:05 AM',
		  payNumber:'87649589',
		  paidBy:'Edmond Halley',
		  type:'Credit Card',
		  amount:'250.00',
		  status:'Successful'
	  },
	  {
		  date:new Date(1551002933),
          time:'02:05 AM',
		  payNumber:'87649589',
		  paidBy:'Elizabeth Blackburn',
		  type:'Offline',
		  amount:'55.05',
		  status:'Unsuccessful'
	  },
	  {
		  date:new Date(),
          time:'10:05 AM',
		  payNumber:'87649589',
		  paidBy:'Elizabeth Blackburn',
		  type:'Credit Card',
		  amount:'87.05',
		  status:'Successful'
	  }
  ];

  displayedColumns: string[] = ['date', 'time', 'payNumber', 'paidBy', 'type', 'amount', 'status', 'menu'];

  @ViewChild(SnackBarComponent) snackComponent: SnackBarComponent;

  quarter:any[] = [
	  {
		  value:'Q1',
		  viewValue:'1st Quarter (Jan to Mar)'
	  },
	  {
		  value:'Q2',
		  viewValue:'2nd Quarter (Apr to Jun)'
	  },
	  {
		  value:'Q3',
		  viewValue:'3rd Quarter (Jul to Sep)'
	  },
	  {
		  value:'Q4',
		  viewValue:'4th Quarter (Oct to Dec)'
	  }
  ];
	tariffs: any[] = [
		{
			title: 'Customer is Active (sample)',
			description: 'Provisional (annual) invoice created for the customer for licensing period specified' + 'Invoice is unpaid/has an open balance'
		},
		{
			title: 'Re:Sound Quarterly Reporting (October to December) - Tariff 5.B',
			description: 'Tariff 5B/Tariff 8 assigned to customer with start date in or prior to reporting period Customer’s seasonal dates fall within the reporting period Customer does not have a report for the tariff/licensing period listed'
		},
		{
			title: '2018 Tariff 8 (sample)',
			description: 'Fourth Quarter Reporting and Payment Reminder'
		},
		{
			title: 'Customer is Active (sample)',
			description: 'Provisional (annual) invoice created for the customer for licensing period specified' + 'Invoice is unpaid/has an open balance'
		},
		{
			title: 'Re:Sound Quarterly Reporting (October to December) - Tariff 5.B',
			description: 'Tariff 5B/Tariff 8 assigned to customer with start date in or prior to reporting period Customer’s seasonal dates fall within the reporting period Customer does not have a report for the tariff/licensing period listed'
		},
		{
			title: '2018 Tariff 8 (sample)',
			description: 'Fourth Quarter Reporting and Payment Reminder'
		}
	];

  optionsList:any[] = [{
	  value:'Active'
  },{
	  value:'Inactive'
  }];

  city:any[] = [
	  {value:'Ottawa'},
	  {value:'Edmonton'},
	  {value:'Victoria'},
	  {value:'Winnipeg'},
	  {value:'Fredericton'},
	  {value:'Toronto'},
	  {value:'Regina'}
  ];

  constructor() {

	this.dataPayments = new MatTableDataSource(this.dataPayments);
	this.dataPayments2 = new MatTableDataSource(this.dataPayments2);

  	this.simpleForm = new FormGroup({
		'simpleInput': new FormControl(null, [Validators.required, Validators.pattern(emailPattern)]),
		'startDate': new FormControl(null, [Validators.required]),
		'simpleRadio': new FormControl(null, [Validators.required]),
		'simpleSelect': new FormControl(null, [Validators.required]),
		'simpleSelectList': new FormControl(null, [Validators.required]),
		'simpleSearch': new FormControl(null, [Validators.required]),
		'simpleOption': new FormControl(null, [Validators.required])
	});

  }

  setDataSourceAttributes() {
	this.dataPayments2.sort = this.sort;
    this.dataPayments2.paginator = this.paginator;
  }

  ngOnInit() {

  }

  getAccess(elem){
	  
  }

  isSet(tabNum) {
    return this.tab === tabNum;
  };

  setTab(newTab) {
    this.tab = newTab;
  };
  openSnackBar(snackMessage: string) {
	this.snackComponent.openSnackBar((snackMessage));
  }

}
