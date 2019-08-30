import {Component, Inject, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {merge} from 'rxjs';
import {debounceTime, finalize, startWith, switchMap} from 'rxjs/operators';
import {AdminPaymentService} from '../admin-payment.service';
import {Payment} from '../../admin-shared/admin.interfaces';
import {SnackBarComponent} from '../../../_shared/components/snack-bar/snack-bar.component';
import {AdminShareService} from '../../admin-shared/admin.share.service';

@Component({
  selector: 'app-admin-payment-history-dashboard',
  templateUrl: './admin-payment-history-dashboard.component.html'
})
export class AdminPaymentHistoryDashboardComponent implements OnInit {

  payments: any = [];
  optionsList: any[] = [
    {value: 'Confirmed'},
    {value: 'Failed'}
  ];
  displayedColumns: string[] = ['select', 'id', 'name', 'total', 'date', 'time', 'status', 'menu'];
  selection: any;
  tableForm: FormGroup;
  tableSearch = false;
  tableSorting = false;
  responsiveTableHeader = false;
  loaderIsVisible = false;
  loadingData = false;
  nothingFound = false;
  tableDataError = false;
  tableServerError = false;
  tableLength = 0;
  exportPaymentsSnack: string;
  exportPaymentsErrorSnack: string;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(SnackBarComponent) snackComponent: SnackBarComponent;

  constructor(private formBuilder: FormBuilder,
              private adminPaymentService: AdminPaymentService,
              @Inject(LOCALE_ID) protected localeId: string,
              private adminShareService: AdminShareService) { }

  ngOnInit() {
    if ( this.localeId === 'en-US' ) {
      this.exportPaymentsSnack = 'Export Successfully Started';
      this.exportPaymentsErrorSnack = 'Export Error Occurred';
    } else {
      this.exportPaymentsSnack = 'L\'exportation a été commencé avec succès';
      this.exportPaymentsErrorSnack = 'Une erreur s’est produite';
    }
    this.payments = new MatTableDataSource();
    this.selection = new SelectionModel(true, []);
    this.tableForm = this.formBuilder.group({
      tableSearch: [null],
      tableSearhStatus: [[]],
      startDate: [null],
      endDate: [null]
    });
    this.tableForm.valueChanges.subscribe((response) => {
      this.paginator.pageIndex = 0;
    });
    merge(this.sort.sortChange, this.paginator.page, this.tableForm.valueChanges)
      .pipe(
        debounceTime(500),
        startWith({}),
        switchMap( () => {
          this.loadingData = true;
          this.nothingFound = false;
          return this.adminPaymentService.getPayments(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex + 1,
            this.paginator.pageSize,
            this.tableForm.get('tableSearch').value,
            this.tableForm.get('tableSearhStatus').value,
            this.tableForm.get('startDate').value,
            this.tableForm.get('endDate').value
          );
        })
      ).subscribe((response: any) => {
        this.tableDataError = false;
        this.nothingFound = false;
        this.tableServerError = false;
        this.selection.clear();
        if ( response.payments ) {
          this.payments.data = response.payments;
          this.payments.sort = this.sort;
          this.tableLength = response.total
          if ( response.total <= this.paginator.pageSize) {
            this.paginator.pageIndex = 0;
          }
        } else if (response === '') {
          this.tableDataError = true;
        } else {
          this.nothingFound = true;
          this.payments.data = [];
          this.tableLength = 0;
        }
        this.loadingData = false;
      });
  }
  tableSearchToggle() {
    this.tableSearch = !this.tableSearch;
    this.tableSorting = false;
    if (this.tableForm.get('tableSearch').value !== '') {
      this.tableForm.get('tableSearch').setValue('');
    }
  }
  tableSortingToggle() {
    this.tableSorting = !this.tableSorting;
    this.tableSearch = false;
  }
  tableHeaderToggle() {
    this.responsiveTableHeader = !this.responsiveTableHeader;
  }
  exportPayments(payment?: Payment) {
    this.loadingData = true;
    const paymentArray = {data: []};
    if ( this.selection.selected.length ) {
      for ( const p of this.selection.selected ) {
        paymentArray.data.push(p.AUTHORIZATION_NO);
      }
    } else {
      paymentArray.data.push(payment.AUTHORIZATION_NO);
    }
    this.adminPaymentService.exportPayments(paymentArray).pipe(
      finalize(() => {
        this.loadingData = false;
      })
    ).subscribe((response) => {
      this.snackComponent.openSnackBar(this.exportPaymentsSnack);
    }, () => {
      this.snackComponent.openSnackBar(this.exportPaymentsErrorSnack);
    });
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.payments.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.payments.data.forEach(row => this.selection.select(row));
  }
  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  setDate(date: any) {
    return this.adminShareService.setDate(date);
  }
  setTime(date: any) {
    return this.adminShareService.setTime(date);
  }
}
