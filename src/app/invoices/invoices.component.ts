import { Component, OnInit, ViewChild, LOCALE_ID, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { merge } from 'rxjs';
import { debounceTime, finalize, startWith, switchMap } from 'rxjs/operators';
import { InvoiceService } from './invoice.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html'
})
export class InvoicesComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  invoicesList: any = [];

  displayedColumns: string[] = ['date', 'number', 'statementId', 'total', 'status', 'menu'];

  filterForm: FormGroup;
  leftPart: boolean;
  rightPart: boolean;
  optionsList: { value: string }[];

  bothPart: boolean;
  loaderIsVisible: boolean;
  nothingFound: boolean;
  total: number = 0;
  tableLength: any;

  constructor(private invoiceService: InvoiceService, @Inject(LOCALE_ID) protected localeId: string) {
    this.filterForm = new FormGroup({
      'number': new FormControl(null),
      'status': new FormControl(null),
      'startDate': new FormControl(null),
      'endDate': new FormControl(null)
    });

    this.optionsList = [
      { value: this.localeId == 'fr' ? 'Payé' : 'Paid' },
      { value: this.localeId == 'fr' ? 'Impayé' : 'Unpaid' }
    ];
  }


  ngOnInit() {
    this.invoicesList = new MatTableDataSource();
    this.filterForm.valueChanges.subscribe((response) => {
      this.paginator.pageIndex = 0;
    });
    merge(this.sort.sortChange, this.paginator.page, this.filterForm.valueChanges)
      .pipe(
        finalize(() => {
          this.loaderIsVisible = false;
        }),
        debounceTime(500),
        startWith({}),
        switchMap(() => {
          this.loaderIsVisible = true;
          this.nothingFound = false;
          return this.invoiceService.getAllInvoices(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex + 1,
            this.paginator.pageSize,
            this.filterForm.get('number').value,
            this.filterForm.get('status').value,
            this.filterForm.get('startDate').value,
            this.filterForm.get('endDate').value
          );
        })
      ).subscribe((response: any) => {
        if (response.invoices) {
          this.invoicesList.data = [...response.invoices];
          this.invoicesList.sort = this.sort;
          this.tableLength = response.total;
          if ( response.total <= this.paginator.pageSize) {
            this.paginator.pageIndex = 0;
          }
        } else if (response === '') {
          this.tableLength = null;
        } else {
          this.nothingFound = true;
          this.invoicesList.data = [];
        }
        this.loaderIsVisible = false;
      });

  }


}
