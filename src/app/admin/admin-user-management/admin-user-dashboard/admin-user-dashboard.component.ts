import {Component, Inject, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SnackBarComponent} from '../../../_shared/components/snack-bar/snack-bar.component';
import {merge} from 'rxjs';
import {debounceTime, finalize, startWith, switchMap} from 'rxjs/operators';
import {AdminUserManagementService} from '../admin.user.management.service';
import {Admin} from '../../admin-shared/admin.interfaces';
import {AdminShareService} from '../../admin-shared/admin.share.service';

@Component({
  selector: 'app-admin-user-dashboard',
  templateUrl: './admin-user-dashboard.component.html'
})
export class AdminUserDashboardComponent implements OnInit {

  users: any = [];
  optionsList: {value: string}[] = [
    {value: 'Active'},
    {value: 'Inactive'}
  ];
  displayedColumns: string[] = ['select', 'id', 'business', 'firstName', 'lastName', 'email', 'date', 'status', 'menu'];
  selection: any;
  tableForm: FormGroup;
  tableSearch = false;
  tableSorting = false;
  responsiveTableHeader = false;
  loaderIsVisible = false;
  loadingData = true;
  nothingFound = false;
  tableLength = 0;
  tableDataError = false;
  tableServerError = false;
  exportUsersSnack: string;
  exportUsersErrorSnack: string;
  toggleAccoutSnack: string;
  toggleAccoutErrorSnack: string;
  resetPasswordSnack: string;
  resetPasswordErrorSnack: string;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(SnackBarComponent) snackComponent: SnackBarComponent;
  constructor(private formBuilder: FormBuilder,
              private adminManagmentService: AdminUserManagementService,
              private adminShareService: AdminShareService,
              @Inject(LOCALE_ID) protected localeId: string) { }
  ngOnInit() {
    if ( this.localeId === 'en-US' ) {
      this.exportUsersSnack = 'Export Successfully Started';
      this.toggleAccoutSnack = 'Account Status Successfully Changed';
      this.resetPasswordSnack = 'New Password Sent';
      this.exportUsersErrorSnack = 'Export Error Occurred';
      this.toggleAccoutErrorSnack = 'Account Status Change Unsuccessful';
      this.resetPasswordErrorSnack =  'Password delivery failure';
    } else {
      this.exportUsersSnack = 'L\'exportation a été commencé avec succès';
      this.toggleAccoutSnack = 'Le statut du compte a été modifié avec succès !';
      this.resetPasswordSnack = 'Envoi de la nouveau mot de passe réussi';
      this.exportUsersErrorSnack = 'Une erreur s’est produite';
      this.toggleAccoutErrorSnack = 'Une erreur s’est produite';
      this.resetPasswordErrorSnack =  'Une erreur s’est produite';
    }
    this.users = new MatTableDataSource();
    this.selection = new SelectionModel(true, []);
    this.tableForm = this.formBuilder.group( {
      tableSearch: [null],
      tableSearhStatus: [[]],
      startDate: [null],
      endDate: [null]
    });
    this.tableForm.valueChanges.subscribe((response) => {
      this.paginator.pageIndex = 0;
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
          return this.adminManagmentService.dashboardManagement(
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
        this.selection.clear();
        if ( response.users ) {
          this.users.data = [...response.users];
          this.users.sort = this.sort;
          this.tableLength = response.total;
          if ( response.total <= this.paginator.pageSize) {
            this.paginator.pageIndex = 0;
          }
        } else if ( response === '' ) {
          this.tableDataError = true;
        } else {
          this.nothingFound = true;
          this.tableLength = 0;
          this.users.data = [];
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
  exportUsers() {
    const usersArray = {data: []};
    if ( this.selection.selected.length ) {
      for (const user of this.selection.selected ) {
        usersArray.data.push(user.AZURE_ID);
      }
      this.adminManagmentService.exportUsers(usersArray).subscribe(
        () => {
          this.snackComponent.openSnackBar(this.exportUsersSnack);
        },
        () => {
          this.snackComponent.openSnackBar(this.exportUsersErrorSnack);
        }
        );
    }
  }
  toggleAccoutStatus(user: Admin) {
    const accountData = {
      id: user.AZURE_ID,
      status: user.ACTIVE === 1 ? 0 : 1
    };
    this.loadingData = true;
    this.tableDataError = false;
    this.nothingFound = false;
    this.tableServerError = false;
    this.adminManagmentService.chageAccountStatus(accountData).pipe(
      finalize(() => {
        this.loadingData = false;
      }),
      switchMap((response) => {
        if ( response ) {
          return this.adminManagmentService.dashboardManagement(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex + 1,
            this.paginator.pageSize,
            this.tableForm.get('tableSearch').value,
            this.tableForm.get('tableSearhStatus').value,
            this.tableForm.get('startDate').value,
            this.tableForm.get('endDate').value
          );
        }
      })
    ).subscribe((response: any) => {
      if ( response.users ) {
        this.users.data = response.users;
      } else if ( response === '') {
        this.tableDataError = true;
        this.snackComponent.openSnackBar(this.toggleAccoutErrorSnack);
      }
      this.snackComponent.openSnackBar(this.toggleAccoutSnack);
    },
      () => {
        this.tableServerError = true;
        this.snackComponent.openSnackBar(this.toggleAccoutErrorSnack);
      });
  }
  resetPassword(user: Admin) {
    this.loaderIsVisible = true;
    this.nothingFound = false;
    this.tableServerError = false;
    this.adminShareService.resetUserPassword(user.AZURE_ID).pipe(
      finalize(() => {
        this.loaderIsVisible = false;
      })
    ).subscribe(() => {
      this.snackComponent.openSnackBar(this.resetPasswordSnack);
    },
      () => {
        this.tableServerError = true;
        this.snackComponent.openSnackBar(this.resetPasswordSnack);
      });
  }
  isAllSelected() {
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
