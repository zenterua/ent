import {Component, Inject, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {SnackBarComponent} from '../../../_shared/components/snack-bar/snack-bar.component';
import {AdminAccountsService} from '../admin.accounts.service';
import {concatMap, debounceTime, finalize, startWith, switchMap} from 'rxjs/operators';
import {merge, concat} from 'rxjs';
import {Admin} from '../../admin-shared/admin.interfaces';
import {AdminShareService} from '../../admin-shared/admin.share.service';
import {trigger} from '@angular/animations';
import {animationPopup} from '../../../_shared/animations';

@Component({
  selector: 'app-admin-accounts-dashboard',
  templateUrl: './admin-accounts-dashboard.component.html',
  animations: [trigger('animationPopup', animationPopup)]
  })
  export class AdminAccountsDashboardComponent implements OnInit {
    currentAdmin: Admin;
    users: any;
    optionsList: any[] = [
      {value: 'Active'},
      {value: 'Inactive'}
    ];
    displayedColumns: string[] = ['select', 'id', 'firstName', 'email', 'date', 'status', 'menu'];
    selection: any;
    tableSearch = false;
    tableSorting = false;
    responsiveTableHeader = false;
    adminCreatePopup = false;
    tableForm: FormGroup;
    activate = false;
    deActivate = false;
    adminEditPopup = false;
    loadingData = false;
    nothingFound = false;
    tableLength = 0;
    loaderIsVisible = false;
    tableDataError = false;
    adminDeletePopup = false;
    tableServerError = false;
    accountStatsusSnack: string;
    accountStatsusErrorSnack: string;
    accountDeleteSnack: string;
    accountDeleteErrorSnack: string;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(SnackBarComponent) snackComponent: SnackBarComponent;
    constructor(private formBuilder: FormBuilder,
                private adminAccountsService: AdminAccountsService,
                @Inject(LOCALE_ID) protected localeId: string,
                private adminShareService: AdminShareService) {
    }
    ngOnInit() {
      if ( this.localeId === 'en-US' ) {
        this.accountStatsusSnack = 'Account Status Successfully Changed';
        this.accountStatsusErrorSnack = 'Account Status Change Unsuccessful';
        this.accountDeleteSnack = 'Account Successfully Deleted';
        this.accountDeleteErrorSnack = 'Account Deletion Unsuccessful';
      } else {
        this.accountStatsusSnack = 'Le compte a été modifié avec succès !';
        this.accountStatsusErrorSnack = 'Une erreur s’est produite';
        this.accountDeleteSnack = 'Le compte a été supprimé avec succès';
        this.accountDeleteErrorSnack = 'Une erreur s’est produite';
      }
      this.users = new MatTableDataSource();
      // this.users.paginator = this.paginator;
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
            return this.adminAccountsService.adminsDashboard(
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
          if ( response.users ) {
            this.users.data = response.users;
            this.users.sort = this.sort;
            this.tableLength = response.total;
            if ( response.total <= this.paginator.pageSize) {
              this.paginator.pageIndex = 0;
            }
          } else if (response === '') {
            this.tableDataError = true;
          } else {
            this.nothingFound = true;
            this.users.data = [];
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
    createAdminAccount(data) {
      this.updateTabledata().pipe(
        finalize(() => {
          this.loadingData = false;
        })
      ).subscribe((response: any) => {
        if ( response.users ) {
          this.users.data = response.users;
          this.tableLength = response.total;
          this.adminCreatePopup = false;
          this.selection.clear();
          this.snackComponent.openSnackBar(data.snackMessage);
        } else if (response === '') {
          this.tableDataError = true;
        } else {
          this.nothingFound = true;
        }
      },
        () => {
          this.tableServerError = true;
          this.snackComponent.openSnackBar(data.snackErrorMessage);
        });
    }
    editAdminAccount(admin: Admin) {
      this.currentAdmin = admin;
      this.adminEditPopup = true;
    }
    submitEditAccount(data) {
      this.loadingData = true;
      this.tableDataError = false;
      this.nothingFound = false;
      this.tableServerError = false;
      this.updateTabledata().pipe(
        finalize(() => {
          this.loadingData = false;
        })
      ).subscribe((response: any) => {
        if ( response.users ) {
          this.users.data = response.users;
          this.adminEditPopup = false;
          this.selection.clear();
          this.snackComponent.openSnackBar(data.submitAccountSnack);
        } else if (response === '') {
          this.tableDataError = true;
          this.snackComponent.openSnackBar(data.submitAccountErrorSnack);
        } else {
          this.nothingFound = true;
        }
      }, () => {
        this.tableServerError = true;
        this.snackComponent.openSnackBar(data.snackErrorMessage);
      });
    }
    deleteAdminAccount() {
      const arrayOfAdmins = {id: []};
      if ( this.selection.selected.length ) {
        for (const admin of this.selection.selected ) {
          arrayOfAdmins.id.push(admin.AZURE_ID);
        }
      } else {
        arrayOfAdmins.id.push(this.currentAdmin.AZURE_ID);
      }
      this.loadingData = true;
      this.tableDataError = false;
      this.nothingFound = false;
      this.tableServerError = false;
      let tablePageIndex = this.paginator.pageIndex + 1;
      this.adminAccountsService.removeAccout(arrayOfAdmins).pipe(
        concatMap((response) => {
          if (this.selection.selected.length === this.users.data.length) {
            tablePageIndex !== 1 ? tablePageIndex -= 1 : tablePageIndex = this.paginator.pageIndex;
            this.paginator.previousPage();
          } else if (this.users.data.length === 1 ) {
            tablePageIndex !== 1 ? tablePageIndex -= 1 : tablePageIndex = this.paginator.pageIndex;
            this.paginator.previousPage();
          } else {
            tablePageIndex = this.paginator.pageIndex + 1;
          }
          return this.updateTabledata(tablePageIndex);
        }),
        finalize(() => {
          this.loadingData = false;
          this.adminDeletePopup = false;
        }),
      ).subscribe((response: any) => {
        if ( response.users ) {
          this.users.data = response.users;
          this.tableLength = response.total;
          this.selection.clear();
          this.snackComponent.openSnackBar(this.accountDeleteSnack);
        } else if (response === '') {
          this.tableDataError = true;
          this.snackComponent.openSnackBar(this.accountDeleteErrorSnack);
        } else {
          this.nothingFound = true;
          this.users.data = [];
          this.tableLength = 0;
        }
      }, () => {
        this.tableServerError = true;
        this.snackComponent.openSnackBar(this.accountDeleteErrorSnack);
      });
    }
    toggleStatus(user?) {
      const arrayOfAdmins = {id: [], status: []};
      this.loadingData = true;
      this.tableDataError = false;
      this.nothingFound = false;
      this.tableServerError = false;

      if ( this.selection.selected.length ) {
        if ( this.deActivate ) {
          for (const admin of this.selection.selected ) {
            arrayOfAdmins.id.push(admin.AZURE_ID);
            arrayOfAdmins.status.push(0);
          }
        }
        if ( this.activate ) {
          for (const admin of this.selection.selected ) {
            arrayOfAdmins.id.push(admin.AZURE_ID);
            arrayOfAdmins.status.push(1);
          }
        }
      } else {
        arrayOfAdmins.id.push(user.AZURE_ID);
        arrayOfAdmins.status.push(user.ACTIVE === 1 ? 0 : 1);
      }
      concat(
        this.adminAccountsService.chageAccountStatus(arrayOfAdmins),
        this.updateTabledata()
      ).pipe(
        finalize(() => {
          this.loadingData = false;
        }),
      ).subscribe((response: any) => {
        if (response.users) {
          this.users.data = response.users;
          this.selection.clear();
          this.snackComponent.openSnackBar(this.accountStatsusSnack);
        } else if (response === '') {
          this.tableDataError = true;
          this.snackComponent.openSnackBar(this.accountStatsusErrorSnack);
        }
      }, () => {
        this.tableServerError = true;
        this.snackComponent.openSnackBar(this.accountStatsusErrorSnack);
      });
    }
    updateTabledata(tablePage?) {
      const updateTabledata = tablePage ? tablePage : this.paginator.pageIndex + 1;
      return this.adminAccountsService.adminsDashboard(
        this.sort.active,
        this.sort.direction,
        updateTabledata,
        this.paginator.pageSize,
        this.tableForm.get('tableSearch').value,
        this.tableForm.get('tableSearhStatus').value,
        this.tableForm.get('startDate').value,
        this.tableForm.get('endDate').value
      );
    }
    selectRow(e, row) {
      this.selection.toggle(row);
      if ( this.selection.selected.length ) {
        for (const item of this.selection.selected) {
          if ( item.ACTIVE === 1 ) {
            this.activate = false;
            this.deActivate = true;
          } else if (  item.ACTIVE === 0 ) {
            this.activate = true;
            this.deActivate = false;
            break;
          }
        }
      }
    }
    isAllSelected() {
      if ( this.selection.selected.length ) {
        for (const item of this.selection.selected) {
          if ( item.ACTIVE === 1 ) {
            this.activate = false;
            this.deActivate = true;
          } else if (  item.ACTIVE === 0 ) {
            this.activate = true;
            this.deActivate = false;
            break;
          }
        }
      }
      const numSelected = this.selection.selected.length;
      const numRows = this.users.data.length;
      return numSelected === numRows;
    }
    masterToggle() {
      this.isAllSelected() ?
        this.selection.clear() :
        this.users.data.forEach(row => this.selection.select(row));
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
  }
