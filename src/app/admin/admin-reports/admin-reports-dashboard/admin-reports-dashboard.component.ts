import {Component, Inject, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatSort, MatTableDataSource, MatPaginator} from '@angular/material';
import {SnackBarComponent} from '../../../_shared/components/snack-bar/snack-bar.component';
import {merge} from 'rxjs';
import {debounceTime, finalize, startWith, switchMap} from 'rxjs/operators';
import {AdminReportsService} from '../admin.reports.service';
import {AdminShareService} from '../../admin-shared/admin.share.service';


@Component({
  selector: 'app-admin-reports-dashboard',
  templateUrl: './admin-reports-dashboard.component.html'
})
export class AdminReportsDashboardComponent implements OnInit {

  reports = new MatTableDataSource([]);
  optionsList: any[] = [
    {value: 'Submitted'},
    {value: 'Draft'}
  ];
  displayedColumns: string[] = ['id', 'name', 'tariff', 'total', 'date', 'status', 'menu'];
  tableForm: FormGroup;
  tableSearch = false;
  tableSorting = false;
  responsiveTableHeader = false;
  loaderIsVisible = false;
  tableLength = 0;
  loadingData = false;
  tableDataError = false;
  nothingFound = false;
  tableServerError = false;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(SnackBarComponent) snackComponent: SnackBarComponent;
  constructor(private formBuilder: FormBuilder,
              private adminReportsService: AdminReportsService,
              private adminShareService: AdminShareService,
              @Inject(LOCALE_ID) public localeId: string) { }
  ngOnInit() {
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
          return this.adminReportsService.getReports(
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
      ).subscribe((response: {reports: any; total: number; count: number} | any ) => {
        if ( response.reports ) {
          this.reports.data = response.reports;
          this.reports.sort = this.sort;
          this.tableLength = response.total;
          if ( response.total <= this.paginator.pageSize) {
            this.paginator.pageIndex = 0;
          }
        } else if (response === '') {
          this.tableDataError = true;
        } else {
          this.nothingFound = true;
          this.reports.data = [];
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
  reportDownload(row, type) {
    this.loaderIsVisible = true;
    const reportType = row.REPORT_ID ? 'reportId' : 'reportNo';
    const reportId = row.REPORT_ID ? row.REPORT_ID : row.REPORT_NO;
    const lang = this.localeId === 'fr' ? 'F' : 'E';
    this.adminShareService.reportDownload(reportType, reportId, 'Report_detail_' + reportId, type, lang).pipe(
      finalize(() => {
        this.loaderIsVisible = false;
      })
    ).subscribe((response) => {
    }, (error) => {
    });
  }
  deleteDrafft(row, index){
	this.loadingData = true;

  	this.adminReportsService.deleteDraftReport(row.REPORT_ID ? 'reportId' : 'reportNo', row.REPORT_ID ? row.REPORT_ID : row.REPORT_NO)
	  .pipe(finalize(() => {
           this.loadingData = false;
	   }))
	  .subscribe((response)=>{
		if (response){
			const removedData = this.reports.data;
			removedData.splice(index, 1);
			this.reports = new MatTableDataSource(removedData);
		}else{
			this.tableDataError = true;
		}
	  }, (error) => {
			this.tableDataError = true;
      });
  }
  setDate(date: any) {
    return this.adminShareService.setDate(date);
  }
}
