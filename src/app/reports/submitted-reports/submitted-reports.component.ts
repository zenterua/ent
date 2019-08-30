import { Component, OnInit, ViewChild, Inject, LOCALE_ID, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { merge, Subscription } from 'rxjs';
import { debounceTime, finalize, startWith, switchMap } from 'rxjs/operators';

import { ReportApiServices } from '../report.api.services';
import { TariffsService } from '../../assign-tariff/tariffs.service';

@Component({
	selector: 'app-submitted-reports',
	templateUrl: './submitted-reports.component.html'
})
export class SubmittedReportsComponent implements OnInit, OnDestroy {
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	reportList = new MatTableDataSource();

	displayedColumns: string[] = ['date', 'id', 'name', 'musicUsage', 'total', 'menu'];

	filterForm: FormGroup;
	leftPart: boolean;
	rightPart: boolean;
	optionsList: any[] = [];
	submitterList: Subscription;
	bothPart: boolean;
	loaderIsVisible: boolean;
	nothingFound: boolean;
	isLoading: boolean;
	tableLength: any;
	isReport: boolean;
	constructor(private reportApiServices: ReportApiServices, private tariffsService: TariffsService, @Inject(LOCALE_ID) public localeId: string) {
		this.filterForm = new FormGroup({
			'name': new FormControl(null),
			'tariffGroup': new FormControl(null),
			'startDate': new FormControl(null),
			'endDate': new FormControl(null)
		});
	}

	ngOnInit() {
		this.getAssignedTariff();
    this.filterForm.valueChanges.subscribe((response) => {
      this.paginator.pageIndex = 0;
    });
	}

	getAssignedTariff() {
		this.tariffsService.assignedAllTariffs(1)
			.pipe(finalize(() => {
				this.getDraftReports();
			}))
			.subscribe((data) => {
				if (data) {
					this.optionsList = [...data];
				} else {
					this.nothingFound = true;
				}
			}, (err) => {
				this.nothingFound = true;
			});
	}

	getDraftReports() {
		this.reportList = new MatTableDataSource();
		this.submitterList = merge(this.sort.sortChange, this.paginator.page, this.filterForm.valueChanges)
			.pipe(
				debounceTime(500),
				startWith({}),
				switchMap(() => {
					this.loaderIsVisible = false;
					this.nothingFound = false;
					return this.reportApiServices.reports(0, this.sort,
						this.paginator,
						this.filterForm.get('name').value,
						this.filterForm.get('tariffGroup').value,
						this.filterForm.get('startDate').value,
						this.filterForm.get('endDate').value);
				})
			).subscribe((response: any) => {
				if (response) {
					if (response.reports) {
						this.reportList.data = [...response.reports];
						this.tableLength = response.total;
						this.isReport = false;
            if ( response.total <= this.paginator.pageSize) {
              this.paginator.pageIndex = 0;
            }
					} else {
						this.nothingFound = true;
						this.reportList.data = [];
						this.tableLength = null;
						this.isReport = false;
					}
				} else {
					this.reportList.data = [];
					this.tableLength = null;
					this.isReport = true;
				}
				this.loaderIsVisible = true;
			}, (error) => {
				this.loaderIsVisible = true;
				this.reportList.data = [];
				this.tableLength = null;
				this.isReport = true;
			});
	}


	ngOnDestroy() {
		if (this.submitterList) { this.submitterList.unsubscribe(); }
	}

	getFilePdf(act, report) {
		this.isLoading = true;
		let reportType = report.REPORT_ID ? 'reportId' : 'reportNo';
		let reportId = report.REPORT_ID ? report.REPORT_ID : report.REPORT_NO;
		let lang = this.localeId == 'fr' ? 'F' : 'E';
		this.reportApiServices.reportDownload(reportType, reportId, 'Report_detail_' + reportId, act, lang)
			.pipe(finalize(() => {
				this.isLoading = false;
			}))
			.subscribe((data) => {

			});
	}


}
