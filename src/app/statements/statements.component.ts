import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import {debounceTime, finalize, startWith, switchMap} from 'rxjs/operators';
import {merge} from 'rxjs';
import {StatementsService} from './statements.service';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-statements',
  templateUrl: './statements.component.html'
})
export class StatementsComponent implements OnInit {
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
  nothingFound = false;
  tableDataError = false;
  tableServerError = false;
  responsiveTableHeader = false;
  loadingData = false;
  tableSorting = false;
  tableSearch = false;
  noStatements = false;
  statementsList = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'period', 'menu'];
  tableForm: FormGroup;
  leftPart: boolean;
  rightPart: boolean;
  loaderIsVisible: boolean;
  tableLength = 0;
  tableLoader = false;
  constructor(private statementsService: StatementsService) {
    this.tableForm = new FormGroup({
      startDate: new FormControl(null),
      endDate: new FormControl(null)
    });
  }

  setDataSourceAttributes() {
    this.statementsList.sort = this.sort;
    this.statementsList.paginator = this.paginator;
  }

  ngOnInit() {
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
          return this.statementsService.getStatements(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex + 1,
            this.paginator.pageSize,
            this.tableForm.get('startDate').value,
            this.tableForm.get('endDate').value
          );
        }),
        finalize(() => {
          this.loadingData = false;
        })
      ).subscribe((response: any) => {
      this.tableDataError = false;
      this.nothingFound = false;
      this.tableServerError = false;
      if ( this.tableForm.get('startDate').value === null && this.tableForm.get('endDate').value === null && !response.statements ) {
        this.noStatements = true;
      }
      if ( response.statements ) {
        this.noStatements = false;
        this.statementsList.data = response.statements;
        this.tableLength = response.total;
        if ( response.total <= this.paginator.pageSize) {
          this.paginator.pageIndex = 0;
        }
      } else if (response === '') {
        this.tableDataError = true;
      } else {
        this.nothingFound = true;
        this.statementsList.data = [];
        this.tableLength = 0;
      }
      this.loadingData = false;
    });
  }
  tableHeaderToggle() {
    this.responsiveTableHeader = !this.responsiveTableHeader;
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
  setDate(d: any) {
    let s = d.split(' ').join('T');
    let t = new Date(s);
    return formatDate(t, 'MMM d, yyyy', 'en-US')
  }
  downloadStatement(statement) {
    this.tableLoader = true;
    this.statementsService.downloadStatement(statement.ID, 'blob', statement.REF_NO).pipe(
      finalize(() => {
        this.tableLoader = false;
      })
    ).subscribe((response) => {

    },(error) => {
     
    });
  }
}
