import {Component, Inject, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {SnackBarComponent} from '../../../_shared/components/snack-bar/snack-bar.component';
import {AdminReminderService} from '../admin-reminder.service';
import {merge} from 'rxjs';
import {concatMap, debounceTime, finalize, startWith, switchMap} from 'rxjs/operators';
import {AdminShareService} from '../../admin-shared/admin.share.service';

@Component({
  selector: 'app-admin-reminders-dashboard',
  templateUrl: './admin-reminders-dashboard.component.html'
  })
export class AdminRemindersDashboardComponent implements OnInit {
  allReminders: any;
  displayedColumns: string[] = ['title', 'endDate', 'province', 'startDate', 'menu'];
  tableForm: FormGroup;
  tableSearch = false;
  tableSorting = false;
  responsiveTableHeader = false;
  loaderIsVisible = false;
  removeRemindersSnack: string;
  loadingData = false;
  nothingFound = false;
  tableDataError = false;
  tableServerError = false;
  tableLength = 0;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(SnackBarComponent) snackComponent: SnackBarComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              @Inject(LOCALE_ID) protected localeId: string,
              private adminReminderService: AdminReminderService,
              private adminShareService: AdminShareService) {
  }

  ngOnInit() {
    if ( this.localeId === 'en-US' ) {
      this.removeRemindersSnack = 'Reminder Successfully Removed';
    } else {
      this.removeRemindersSnack = 'Reminder Successfully Removed FR';
    }
    this.allReminders = new MatTableDataSource();
    this.tableForm = this.formBuilder.group({
      tableSearch: [null],
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
          return this.adminReminderService.getAllReminders(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex + 1,
            this.paginator.pageSize,
            this.tableForm.get('tableSearch').value,
            this.tableForm.get('startDate').value,
            this.tableForm.get('endDate').value
          );
        })
      ).subscribe((response: any) => {
      this.tableDataError = false;
      this.nothingFound = false;
      this.tableServerError = false;
      if ( response.reminders ) {
        response.reminders = this.tariffsRemains(response.reminders);
        this.allReminders.data = response.reminders;
        this.tableLength = response.total;
        if ( response.total <= this.paginator.pageSize) {
          this.paginator.pageIndex = 0;
        }
      } else if (response === '') {
        this.tableDataError = true;
      } else {
        this.nothingFound = true;
        this.allReminders.data = [];
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
  removeReminders(row) {
    this.loaderIsVisible = true;
    const reminderId = {id: row.ID};
    let tablePageIndex = this.paginator.pageIndex + 1;
    this.adminReminderService.removeReminder(reminderId).pipe(
      concatMap((response) => {
        if ( response && this.allReminders.data.length === 1 ) {
          this.snackComponent.openSnackBar(this.removeRemindersSnack);
          tablePageIndex !== 1 ? tablePageIndex -= 1 : tablePageIndex = this.paginator.pageIndex;
          this.paginator.previousPage();
        }
        return this.adminReminderService.getAllReminders(
          this.sort.active,
          this.sort.direction,
          tablePageIndex,
          this.paginator.pageSize,
          this.tableForm.get('tableSearch').value,
          this.tableForm.get('startDate').value,
          this.tableForm.get('endDate').value
        );
      }),
      finalize(() => {
        this.loaderIsVisible = false;
      })
    ).subscribe((response: any) => {
      if ( response.reminders || response.total ) {
        response.reminders = this.tariffsRemains(response.reminders);
        this.tableLength = response.total;
        this.allReminders.data = response.reminders;
        if ( response.total <= this.paginator.pageSize) {
          this.paginator.pageIndex = 0;
        }
      }
      if ( !response.total ) {
        this.nothingFound = true;
        this.allReminders.data = [];
      }

    }, (error) => {
      console.log(error);
    });
  }
  tariffsRemains(reminders) {
    reminders.forEach(reminderItem => {
      const province = reminderItem.PROVINCE.split('|');
      reminderItem.PROVINCE = province.filter(item => {
        if ( item !== '' ) {
          return item;
        }
      } );
    });
    reminders = reminders.map(reminder => {
      if ( reminder.PROVINCE.length > 6 ) {
        const remains = reminder.PROVINCE.splice(6, );
        reminder.PROVINCE = reminder.PROVINCE.splice(0, 6);
        return {
          ...reminder,
          remains
        };

      } else {
        return {
          ...reminder,
          remains: []
        };
      }
    });
    return reminders;
  }
  setDate(date: any) {
    return this.adminShareService.setDate(date);
  }

}
