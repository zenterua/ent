import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {merge, Subscription} from 'rxjs';
import {debounceTime, startWith, switchMap} from 'rxjs/operators';
import {SnackBarComponent} from '../../../_shared/components/snack-bar/snack-bar.component';
import {AdminImpersonationService} from '../admin-impersonation.service';
import {CookieService} from '../../../_shared/services/cookie.service';
import {Router} from '@angular/router';
import {ImpersonationHeaderService} from '../../../_shared/services/impersonation.header.service';
import {AdminMeService} from '../../admin-shared/admin.me.service';
import {AdminShareService} from '../../admin-shared/admin.share.service';

@Component({
  selector: 'app-admin-impersonation-dashboard',
  templateUrl: './admin-impersonation-dashboard.component.html'
})
export class AdminImpersonationDashboardComponent implements OnInit, OnDestroy {
  users: any = [];
  optionsList: any[] = [
    {value: 'Active'},
    {value: 'Inactive'}
  ];
  tableForm: FormGroup;
  responsiveTableHeader = false;
  tableSearch = false;
  tableSorting = false;
  displayedNewLicenseesColumns: string[] = ['id', 'company', 'firstName', 'email', 'date', 'menu'];
  loadingData = false;
  nothingFound = false;
  tableDataError = false;
  tableServerError = false;
  tableLength = 0;
  adminId: any;
  private adminSub: Subscription;
  private usersSub: Subscription;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(SnackBarComponent) snackComponent: SnackBarComponent;
  constructor(private formBuilder: FormBuilder,
              private adminImpersonationService: AdminImpersonationService,
              private cookieService: CookieService,
              private route: Router,
              private impersonationService: ImpersonationHeaderService,
              private adminMe: AdminMeService,
              private adminShareService: AdminShareService) {}

  ngOnInit() {
    this.users = new MatTableDataSource();
    this.tableForm = this.formBuilder.group( {
      tableSearch: [null],
      startDate: [null],
      endDate: [null]
    });
    this.tableForm.valueChanges.subscribe((response) => {
      this.paginator.pageIndex = 0;
    });
    this.usersSub = merge(this.sort.sortChange, this.paginator.page, this.tableForm.valueChanges)
      .pipe(
        debounceTime(500),
        startWith({}),
        switchMap( () => {
          this.loadingData = true;
          this.nothingFound = false;
          return this.adminImpersonationService.dashboardUsers(
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
      if ( response.users ) {
        this.users.data = [...response.users];
        this.users.sort = this.sort;
        this.tableLength = response.total;
      } else if ( response === '' ) {
        this.tableDataError = true;
      } else {
        this.nothingFound = true;
        this.users.data = [];
        this.tableLength = 0;
      }
      this.loadingData = false;
    });

	this.getAdminInfo();
  }
  getAdminInfo(){
	this.adminSub = this.adminMe.aboutMe()
	  .subscribe(() => {
	  this.adminId = `${this.adminMe.adminInfo.ACCT_NO}`;
	}, (error) => {

	});
  }

  ngOnDestroy() {
	  if(this.adminSub){this.adminSub.unsubscribe();}
	  if(this.usersSub){this.usersSub.unsubscribe();}
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
  impersonationToggle(user?) {
    this.cookieService.setCookie('azureId', user.AZURE_ID, 4);
    this.cookieService.setCookie('adminId', this.adminId, 4);
    this.route.navigate(['/reports/new-report']);
    this.impersonationService.impersonationStart(true);
  }
  setDate(date: any) {
    return this.adminShareService.setDate(date);
  }
}
