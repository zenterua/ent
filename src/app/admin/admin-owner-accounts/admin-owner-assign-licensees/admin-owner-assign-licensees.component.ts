import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { SnackBarComponent } from 'src/app/_shared/components/snack-bar/snack-bar.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AdminOwnersService } from '../admin.owners.service';
import { merge } from 'rxjs';
import {startWith, debounceTime, switchMap, finalize, concatMap} from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-admin-owner-assign-licensees',
  templateUrl: './admin-owner-assign-licensees.component.html',
  styleUrls: ['./admin-owner-assign-licensees.component.scss']
})
export class AdminOwnerAssignLicenseesComponent implements OnInit, OnDestroy {
  licenseesList: any;
  selection: any;
  tableForm: FormGroup;
  loadingData = false;
  nothingFound = false;
  tableDataError = false;
  tableServerError = false;
  responsiveTableHeader = false;
  tableSearch = false;
  tableLength = 0;
  assignedCounter = 0;
  displayedColumns: string[] = ['select', 'id', 'business', 'firstName', 'email'];
  ownerChildList: Subscription;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('ownerSelectTable', {read: MatSort}) ownerSelectedSort: MatSort;
  @ViewChild(SnackBarComponent) snackComponent: SnackBarComponent;
  @Input() ownerId: string;
  @Output() assignEmitter = new EventEmitter<any>();
  @Output() closePopup = new EventEmitter<boolean>();

  editedObj:any = {
    remove:[],
    add:[],
    ownerId:null
  };
  constructor(private formBuilder: FormBuilder, private adminOwnersService: AdminOwnersService, private activatedRoute : ActivatedRoute) { }
  ngOnInit(){
    this.licenseesList = new MatTableDataSource();
    this.selection = new SelectionModel(true, []);
    this.tableForm = this.formBuilder.group({
      tableSearch: [null]
    });
    this.tableForm.valueChanges.subscribe((response) => {
      this.paginator.pageIndex = 0;
    });
    this.adminOwnersService.getOwnerLicensees(
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex + 1,
      this.paginator.pageSize,
      this.tableForm.get('tableSearch').value,
      this.ownerId,
      true
    ).pipe(
      concatMap((response: any) => {
        return merge(this.sort.sortChange, this.paginator.page, this.tableForm.valueChanges).pipe(
          debounceTime(500),
          startWith({}),
          switchMap( () => {
            this.loadingData = true;
            this.nothingFound = false;
            return this.adminOwnersService.getOwnerLicensees(
              this.sort.active,
              this.sort.direction,
              this.paginator.pageIndex + 1,
              this.paginator.pageSize,
              this.tableForm.get('tableSearch').value,
              this.ownerId,
              false
            );
          })
        );
      })
    ).subscribe((responseDashboard: any) => {
      this.tableDataError = false;
      this.selection.clear();
      if ( responseDashboard.users ) {
        this.licenseesList.data = [...responseDashboard.users];
        this.licenseesList.sort = this.sort;
        this.tableLength = responseDashboard.total;
        this.setEditedUser();
      } else if ( responseDashboard === '' ) {
        this.tableDataError = true;
      } else {
        this.nothingFound = true;
        this.licenseesList.data = [];
        this.tableLength = 0;
      }
      this.loadingData = false;
    });

    this.editedObj.ownerId = this.ownerId;
    if (window.localStorage.getItem('EDITED_ARR')){
      window.localStorage.removeItem('EDITED_ARR');
    }
  }

  ngOnDestroy(){
    if (window.localStorage.getItem('EDITED_ARR')){
      window.localStorage.removeItem('EDITED_ARR');
    }
    if (this.ownerChildList){
      this.ownerChildList.unsubscribe();
    }
  }

  setEditedUser(){
    if (window.localStorage.getItem('EDITED_ARR')){
      this.selection.clear();
      let obj = JSON.parse(window.localStorage.getItem('EDITED_ARR'));
      let deletArr = obj.remove;
      let addArr = obj.add;
      this.licenseesList.data.forEach((i)=>{
        addArr.forEach((x)=>{
          if (i.ACCT_NO == x){
            i.checked = 'add';
          }
        });
        deletArr.forEach((y)=>{
          if (i.ACCT_NO == y){
            i.checked = 'remove';
          }
        });
      });
    }
  }

  isChecked(row){

    if (row.checked == 'remove' && row.HO_ACCT_NO){
      return false;
    }else if (row.checked == 'add' && row.HO_ACCT_NO){
      return true;
    }else if (row.checked == 'add' && !row.HO_ACCT_NO){
      return true;
    }else if (!row.checked && row.HO_ACCT_NO){
      return true;
    }else{
      return false;
    }
  }

  editChildAssigned(event, row, i){
    if (row.HO_ACCT_NO){
      if (!event.checked){
        this.editedObj.remove.push(row.ACCT_NO);
      }else{
              let index = this.editedObj.remove.indexOf(row.ACCT_NO);
        if (index > -1) {this.editedObj.remove.splice(index, 1);}
      }
    }else{
      if (event.checked){
          this.editedObj.add.push(row.ACCT_NO);
        this.assignedCounter ++;
      }else{
        let index = this.editedObj.add.indexOf(row.ACCT_NO);
        this.assignedCounter --;
        if (index > -1) {this.editedObj.add.splice(index, 1);}
      }
    }
    window.localStorage.setItem('EDITED_ARR', JSON.stringify(this.editedObj));
  }

  assignLicenseesToOwner() {
    this.tableDataError = false;
    const assignLicenseesArray = JSON.parse(window.localStorage.getItem('EDITED_ARR'));
    if ( assignLicenseesArray && ( assignLicenseesArray.add.length || assignLicenseesArray.remove.length )) {
      this.loadingData = true;
      this.adminOwnersService.assignLicenseesToOwner(assignLicenseesArray).pipe(
        finalize(() => {
          this.loadingData = false;
        })
      ).subscribe((response) => {
        this.assignEmitter.emit(response);
        if (window.localStorage.getItem('EDITED_ARR')){
          window.localStorage.removeItem('EDITED_ARR');
        }
      }, (error) => {
        this.tableDataError = true;
      });
    } else {
      this.closePopup.emit(false);
    }
  }

  tableHeaderToggle() {
    this.responsiveTableHeader = !this.responsiveTableHeader;
  }
  tableSearchToggle() {
    this.tableSearch = !this.tableSearch;
    if (this.tableForm.get('tableSearch').value !== '') {
      this.tableForm.get('tableSearch').setValue('');
    }
  }
  isAllSelected() {
    if (!this.licenseesList.data) {
      return false;
    }
    const numSelected = this.selection.selected.length;
    const numRows = this.licenseesList.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.licenseesList.data.forEach(row => this.selection.select(row));
  }
  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}

