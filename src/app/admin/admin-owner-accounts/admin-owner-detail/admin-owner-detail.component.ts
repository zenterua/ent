import {Component, Inject, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatSort, MatTableDataSource, MatPaginator} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {ActivatedRoute} from '@angular/router';
import {SnackBarComponent} from '../../../_shared/components/snack-bar/snack-bar.component';
import {animationPopup, voidSlideUpDown} from '../../../_shared/animations';
import {trigger} from '@angular/animations';
import { AdminOwnersService } from '../admin.owners.service';
import {finalize, debounceTime, startWith, switchMap, concatMap} from 'rxjs/operators';
import {merge, concat, Observable} from 'rxjs';
import {AdminShareService} from '../../admin-shared/admin.share.service';


@Component({
  selector: 'app-admin-owner-detail',
  templateUrl: './admin-owner-detail.component.html',
  animations: [trigger('voidSlideUpDown', voidSlideUpDown), trigger('animationPopup', animationPopup)]
})
export class AdminOwnerDetailComponent implements OnInit {
  ownerPopup = false;
  assignLicenseesPopup = false;
  responsiveTableHeader = false;
  tableSearch = false;
  selectedLicensees: any;
  displayedOwnersColumns: string[] = ['select', 'id', 'firstName', 'business', 'email', 'menu'];
  tableForm: FormGroup;
  loaderIsVisible = false;
  confirmLicenseesDelete = false;
  ownerDeleteSnack: string;
  removeLicenseesSnack: string;
  ownerRemoveSnack: string;
  submitEditOwnerSnack: string;
  submitEditOwnerErrorSnack: string;
  ownerInfo = {
    businessName: '',
    legalName: '',
    createDate: '1970-01-01',
    accountNumber: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    primaryContact: '',
    email: '',
    phoneNumber: '',
    firstName: '',
    lastName: ''
  };
  ownerChildInfo = {};
  userId: string;
  loadingData = false;
  nothingFound = false;
  tableDataError = false;
  tableLength = 0;
  ownerOnly = true;
  selection: any;
  selectedOwnerId: string;
  assingNewOwnerSnack: string;
  assingNewOwnerErrorSnack: string;
  licenseesRemoveArray: any;
  tableServerError = false;
  allLicensees = 0;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(SnackBarComponent) snackComponent: SnackBarComponent;
  constructor(private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              @Inject(LOCALE_ID) protected localeId: string,
              private adminOwnersService: AdminOwnersService,
              private adminShareService: AdminShareService) {
  }
  ngOnInit() {
    if ( this.localeId === 'en-US' ) {
      this.ownerDeleteSnack = 'Owner Successfully Deleted';
      this.ownerRemoveSnack = 'Owners Successfully Removed';
      this.removeLicenseesSnack = 'Owner Licensees Successfully Removed';
      this.submitEditOwnerSnack = 'Owner Account Detail Changed';
      this.submitEditOwnerErrorSnack = 'Owner Account Detail Could Not Be Updated';
      this.assingNewOwnerSnack = 'Licensees Successfully Assigned';
      this.assingNewOwnerErrorSnack = 'Unable to Assign Licensees';
    } else {
      this.ownerDeleteSnack = 'Le propriétaire a été supprimé avec succès';
      this.ownerRemoveSnack = 'Les propriétaires ont été retirés avec succès !';
      this.removeLicenseesSnack = 'Licenciés pour ce propriétaire ont été retirés avec succès !';
      this.submitEditOwnerSnack = 'Détails du compte propriétaire ont été modifiés avec succès !';
      this.submitEditOwnerErrorSnack = 'Une erreur s’est produite';
      this.assingNewOwnerSnack = 'Licenciés ont été affectés avec succès';
      this.assingNewOwnerErrorSnack = 'Une erreur s’est produite';
    }
    this.selectedLicensees = new MatTableDataSource();
    this.selection = new SelectionModel(true, []);
    this.tableForm = this.formBuilder.group({
      tableSearch: [null]
    });
    this.userId = this.activatedRoute.snapshot.params.id;
    this.getOwnerData();
    this.updateOwnerAssignedLicensees();

    this.tableForm.valueChanges.subscribe((response) => {
      this.paginator.pageIndex = 0;
    });

  }
  tableSearchToggle() {
    this.tableSearch = !this.tableSearch;
    if (this.tableForm.get('tableSearch').value !== '') {
      this.tableForm.get('tableSearch').setValue('');
    }
  }
  tableHeaderToggle() {
    this.responsiveTableHeader = !this.responsiveTableHeader;
  }
  openAssignLicenseesPopup() {
    this.assignLicenseesPopup = true;
    this.selectedOwnerId = this.userId;
  }
  openRemoveLicenseesConffirm(row) {
    this.licenseesRemoveArray = {
      ownerId: this.userId,
      id: []
    };
    this.licenseesRemoveArray.id.push(row.ACCT_NO);
    this.confirmLicenseesDelete = true;
  }
  deleteSelectedLicensees() {
    this.licenseesRemoveArray = {
      ownerId: this.userId,
      id: []
    };
    this.selection.selected.forEach((licensee) => {
      this.licenseesRemoveArray.id.push(licensee.ACCT_NO);
    });
    this.confirmLicenseesDelete = true;
  }
  removeLicensees() {
    this.loadingData = true;
    let tablePageIndex = this.paginator.pageIndex + 1;
    this.adminOwnersService.removeLicensees(this.licenseesRemoveArray).pipe(
      concatMap((response) => {
        if (this.selection.selected.length === this.selectedLicensees.data.length) {
          tablePageIndex !== 1 ? tablePageIndex -= 1 : tablePageIndex = this.paginator.pageIndex;
          this.paginator.previousPage();
        } else if (this.selectedLicensees.data.length === 1 ) {
          tablePageIndex !== 1 ? tablePageIndex -= 1 : tablePageIndex = this.paginator.pageIndex;
          this.paginator.previousPage();
        } else {
          tablePageIndex = this.paginator.pageIndex + 1;
        }

        return this.updateTabledata();
      }),
      finalize(() => {
        this.loadingData = false;
        this.confirmLicenseesDelete = false;
      })
    ).subscribe((response) => {
      if ( response.total === 0 ) {
        this.selection.clear();
        this.allLicensees = 0;
        this.selectedLicensees.data = [];
        this.snackComponent.openSnackBar(this.removeLicenseesSnack);
      }
      if ( response.users ) {
        this.selection.clear();
        this.allLicensees = response.total;
        this.selectedLicensees.data = [...response.users];
        this.selectedLicensees.sort = this.sort;
        this.tableLength = response.total;

        this.snackComponent.openSnackBar(this.removeLicenseesSnack);
      }
    }, (error) => {
      this.tableDataError = true;
    });
  }
  editOwnerProfile(){
    this.ownerPopup = true;
    this.ownerChildInfo = this.ownerInfo;
  }
  updateOwnerData(event) {
    if ( event ) {
      this.ownerPopup = false;
      this.getOwnerData();
    }
  }
  getOwnerData() {
    this.loaderIsVisible = true;
    this.adminOwnersService.getOwnerDetail(this.userId).pipe(
      finalize(() => {
        this.loaderIsVisible = false;
      })
    ).subscribe((response: any) => {
      if (response) {
        this.ownerInfo.businessName = response.owner.NAME;
        this.ownerInfo.legalName = response.owner.NAME;
        this.ownerInfo.createDate = response.owner.CREATION_DATE;
        this.ownerInfo.accountNumber = response.owner.ACCT_NO;
        this.ownerInfo.address = response.owner.ADDRESS1;
        this.ownerInfo.city = response.owner.CITY;
        this.ownerInfo.province = response.owner.PROVINCE;
        this.ownerInfo.postalCode = response.owner.POSTAL_CODE;
        this.ownerInfo.primaryContact = response.contact.CONTACT_FIRST_NAME + ' ' + response.contact.CONTACT_LAST_NAME;
        this.ownerInfo.email = response.contact.E_MAIL;
        this.ownerInfo.phoneNumber = response.contact.EPR_PHONE_NO ? response.contact.EPR_PHONE_NO : response.contact.PHONE_NO;
        this.ownerInfo.firstName = response.contact.CONTACT_FIRST_NAME;
        this.ownerInfo.lastName = response.contact.CONTACT_LAST_NAME;
      }
    }, (error) => {
      console.log(error);
    });
  }
  updateTabledata(): Observable<any> {
    return this.adminOwnersService.getOwnerLicensees(
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex + 1,
      this.paginator.pageSize,
      this.tableForm.get('tableSearch').value,
      this.userId,
      this.ownerOnly
    );
  }
  assignLicenseesSuccess(event) {
    if ( event ) {
      this.assignLicenseesPopup = false;
      this.snackComponent.openSnackBar(this.assingNewOwnerSnack);
      this.updateOwnerAssignedLicensees();
    }
  }
  updateOwnerAssignedLicensees() {
    merge(this.sort.sortChange, this.paginator.page, this.tableForm.valueChanges).pipe(
      debounceTime(500),
      startWith({}),
      switchMap( () => {
        this.loadingData = true;
        this.nothingFound = false;
        return this.updateTabledata();
      })
    ).subscribe((response: any) => {
      this.tableDataError = false;
      this.selection.clear();
      if ( response.users ) {
        this.allLicensees = response.total;
        this.selectedLicensees.data = [...response.users];
        this.selectedLicensees.sort = this.sort;
        this.tableLength = response.total;
        if ( response.total <= this.paginator.pageSize) {
          this.paginator.pageIndex = 0;
        }
      } else if ( response === '' ) {
        this.tableDataError = true;
      } else {
        this.nothingFound = true;
        if ( !this.tableForm.get('tableSearch').value ) {
          this.allLicensees = 0;
        }
        this.selectedLicensees.data = [];
        this.tableLength = 0;
      }
      this.loadingData = false;
    });
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.selectedLicensees.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.selectedLicensees.data.forEach(row => this.selection.select(row));
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
