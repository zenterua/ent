import {Component, OnInit, ViewChild, LOCALE_ID, Inject, OnDestroy} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { merge, Subscription} from 'rxjs';
import { debounceTime, startWith, switchMap } from 'rxjs/operators';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { PaymentHistoryService } from './payment.history.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html'
})
export class PaymentHistoryComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  paymentsList = new MatTableDataSource();
  displayedColumns: string[] = ['date', 'time', 'id', 'name', 'type', 'total', 'status', 'menu'];
  filterForm: FormGroup;
  leftPart: boolean;
  rightPart: boolean;
  bothPart: boolean;
  optionsList: { value: string }[];
  loaderIsVisible: boolean;
  tableLength: any;
  nothingFound: boolean;
  getPaymentList: Subscription;

  constructor(private paymentHistoryService: PaymentHistoryService, private router: Router, @Inject(LOCALE_ID) protected localeId: string) {
    this.filterForm = new FormGroup({
      'name': new FormControl(null),
      'status': new FormControl(null),
      'startDate': new FormControl(null),
      'endDate': new FormControl(null)
    });
  }

  ngOnInit() {
    this.getAlllPayments();
    this.optionsList = [
      { value: this.localeId == 'fr' ? 'Confirmée' : 'Confirmed' },
      { value: this.localeId == 'fr' ? 'Échec' : 'Failed' }
    ];
    this.filterForm.valueChanges.subscribe((response) => {
      this.paginator.pageIndex = 0;
    });
  };

  getAlllPayments() {
    this.getPaymentList = merge(this.sort.sortChange, this.paginator.page, this.filterForm.valueChanges)
      .pipe(
        debounceTime(500),
        startWith({}),
        switchMap(() => {
          this.loaderIsVisible = false;
          this.nothingFound = false;
          return this.paymentHistoryService.getAllPayments(
            this.sort,
            this.paginator,
            this.filterForm.get('name').value,
            this.filterForm.get('status').value,
            this.filterForm.get('startDate').value,
            this.filterForm.get('endDate').value
          );
        })
      ).subscribe((response: any) => {
        if (response.payments) {
          this.paymentsList.data = [...response.payments];
          if ( response.total <= this.paginator.pageSize) {
            this.paginator.pageIndex = 0;
          }
          this.tableLength = response.total;
        } else if (response.total == 0) {
           this.nothingFound = true;
        } else {
           this.paymentsList.data = [];
           this.tableLength = null;
        }
        this.loaderIsVisible = true;
      }, (error) => {
        this.loaderIsVisible = true;
        this.nothingFound = true;
        this.paymentsList.data = [];
      });
  }

  ngOnDestroy() {
    if (this.getPaymentList) { this.getPaymentList.unsubscribe(); }
  }

  print(num: any) {
    this.router.navigate(['/payments/payment-detail/', num], { queryParams: { print: num } });
  }

  setTime(time: any) {
    let s = time.split(' ').join('T');
    let t = new Date(s);
    return formatDate(t, 'h:mm a', 'en-US')
  }

  setDate(d: any) {
    let s = d.split(' ').join('T');
    let t = new Date(s);
    return formatDate(t, 'MMM d, yyyy', 'en-US')
  }

}
