import {Component, Inject, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatSort, MatTableDataSource, MatPaginator} from '@angular/material';
import {SnackBarComponent} from '../../../_shared/components/snack-bar/snack-bar.component';
import {animationPopup, voidSlideUpDown} from '../../../_shared/animations';
import {trigger} from '@angular/animations';
import { merge } from 'rxjs';
import { debounceTime, startWith, switchMap } from 'rxjs/operators';
import { AdminOwnersService } from '../admin.owners.service';
import {AdminShareService} from '../../admin-shared/admin.share.service';

@Component({
	selector: 'app-admin-owners-dashboard',
	templateUrl: './admin-owners-dashboard.component.html',
	animations: [trigger('voidSlideUpDown', voidSlideUpDown), trigger('animationPopup', animationPopup)]
})
export class AdminOwnersDashboardComponent implements OnInit {
	optionsList: any[] = [
		{value: 'Active'},
		{value: 'Inactive'}
	];
	users: any;
	displayedColumns: string[] = ['id', 'business', 'firstName', 'lastName', 'email', 'city', 'province', 'date', 'menu'];
	tableForm: FormGroup;
	tableSearch = false;
	tableSorting = false;
	responsiveTableHeader = false;
	createOwnerAccount = false;
	assignLicensees = false;
	loaderIsVisible = false
  accountStatsusSnack: string;
	accountStatsusErrorSnack: string;
	ownerSuccessCreated: string;
	ownerErrorCreated: string;
	selectedOwnerId: string;
	loadingData = false;
	nothingFound = false;
	tableDataError = false;
	tableLength = 0;
	assingNewOwnerSnack: string;
	assingNewOwnerErrorSnack: string;

	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild('ownerSelectTable', {read: MatSort}) ownerSelectedSort: MatSort;
	@ViewChild(SnackBarComponent) snackComponent: SnackBarComponent;
	constructor(private formBuilder: FormBuilder,
              @Inject(LOCALE_ID) protected localeId: string,
              private adminOwnersService: AdminOwnersService,
              private adminShareService: AdminShareService) {}
	ngOnInit() {
		if ( this.localeId === 'en-US' ) {
			this.accountStatsusSnack = 'Account Status Successfully Changed';
			this.accountStatsusErrorSnack = 'Account Status Change Unsuccessful';
			this.ownerSuccessCreated = 'Owner Successfully Created';
			this.ownerErrorCreated = 'Owner Creation Unsuccessful';
			this.assingNewOwnerSnack = 'Licensees Successfully Assigned';
			this.assingNewOwnerErrorSnack = 'Unable to Assign Licensees';
		} else {
			this.accountStatsusSnack = 'Le statut du compte a été modifié avec succès !';
			this.accountStatsusErrorSnack = 'Une erreur s’est produite';
			this.ownerSuccessCreated = 'Création du propriétaire réussie';
			this.ownerErrorCreated = 'Une erreur s’est produite';
			this.assingNewOwnerSnack = 'Une erreur s’est produite';
		}
		this.users = new MatTableDataSource();


		this.tableForm = this.formBuilder.group({
			tableSearch: [null],
			tableSearhProvince: [null],
			startDate: [null],
      		endDate: [null]
		});
    this.tableForm.valueChanges.subscribe((response) => {
      this.paginator.pageIndex = 0;
    });
		this.users.sort = this.sort;
		merge(this.sort.sortChange, this.paginator.page, this.tableForm.valueChanges).pipe(
			debounceTime(500),
			startWith({}),
			switchMap( () => {
				this.loadingData = true;
				this.nothingFound = false;
				return this.adminOwnersService.getOwners(
					this.sort.active,
					this.sort.direction,
					this.paginator.pageIndex + 1,
					this.paginator.pageSize,
					this.tableForm.get('tableSearch').value,
					this.tableForm.get('tableSearhProvince').value,
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
        if ( response.total <= this.paginator.pageSize) {
          this.paginator.pageIndex = 0;
        }
			} else if ( response === '' ) {
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
	selectLicensees(row) {

		this.assignLicensees = true;
		this.selectedOwnerId = row.ACCT_NO;
	}
	newOwnerCreated(event) {
		this.createOwnerAccount = false;
		this.snackComponent.openSnackBar(this.ownerSuccessCreated);

	}
	assignLicenseesSuccess(event) {
		if ( event ) {
		  this.assignLicensees = false;
		  this.snackComponent.openSnackBar(this.assingNewOwnerSnack);
		}
	}
  setDate(date: any) {
    return this.adminShareService.setDate(date);
  }
  closePopup(event: boolean) {
	  this.assignLicensees = event;
  }
}
