import { Component, OnInit, ViewChild, Inject, LOCALE_ID, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';

import { merge, Subscription } from 'rxjs';
import { debounceTime, finalize, startWith, switchMap } from 'rxjs/operators';
import { ReportApiServices } from '../report.api.services';
import { ReportCounterService } from './report.counter.service';
import { TariffsService } from '../../assign-tariff/tariffs.service';
import {trigger} from '@angular/animations';
import {animationPopup} from '../../_shared/animations';

@Component({
	selector: 'app-draft-reports',
	templateUrl: './draft-reports.component.html',
  animations: [trigger('animationPopup', animationPopup)]
})
export class DraftReportsComponent implements OnInit {
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	reportList: any = [];

	displayedColumns: string[] = ['draft', 'name', 'musicUsage', 'total', 'date', 'delete'];

	filterForm: FormGroup;
	leftPart: boolean;
	rightPart: boolean;
	optionsList: any[] = [];
	draftsList: Subscription;
	deletedIndex: any = {};
	deleteDraftPopup: boolean;
	bothPart: boolean;
	loaderIsVisible: boolean;
	nothingFound: boolean;
	serverError: boolean;
	tableLength: any;
	isReport: boolean;
	impersionateModeError: boolean;
	sortObj: any = {};

	constructor(private reportApiServices: ReportApiServices, private tariffsService: TariffsService, private reportCounterService: ReportCounterService, @Inject(LOCALE_ID) public localeId: string) {
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

	getDraftReports(){
		this.reportList = new MatTableDataSource();
		this.draftsList = merge(this.sort.sortChange, this.paginator.page, this.filterForm.valueChanges)
			.pipe(
				debounceTime(500),
				startWith({}),
				switchMap(() => {
					this.loaderIsVisible = false;
					this.nothingFound = false;
					return this.reportApiServices.reports(1, this.sort,
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
						this.reportCounterService.changeNumber(response.total);
						this.isReport = false;
					} else {
						this.nothingFound = true;
						this.reportList.data = [];
						this.tableLength = null;
						this.isReport = false;
					}
				} else {
					this.reportList.data = [];
					this.reportCounterService.changeNumber(0);
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
		if (this.draftsList) { this.draftsList.unsubscribe(); }
	}

	deleteDraft(index: any, type: any, id: any) {
		this.deleteDraftPopup = true;
		this.deletedIndex = {
			index: index,
			type: type,
			id: id
		};
	}

	confirmDeleteDraft() {
		this.loaderIsVisible = false;
		const removedData = this.reportList.data;
		this.reportApiServices.removeDraftReport(this.deletedIndex.type, this.deletedIndex.id)
			.pipe(finalize(() => {
				this.loaderIsVisible = true;
				this.deleteDraftPopup = false;
				this.deletedIndex = {};
			}))
			.subscribe((data) => {
				if (data) {
					this.getDraftReports();
				}else{
					this.serverError = true;
				}
			}, (error) => {
				this.serverError = true;
				if (error.error.errorCode == 3) {
					this.impersionateModeError = true;
				}
			});
	}

}
