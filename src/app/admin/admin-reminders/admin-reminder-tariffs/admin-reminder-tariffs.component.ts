import {Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-admin-reminder-tariffs',
  templateUrl: './admin-reminder-tariffs.component.html',
  styleUrls: ['./admin-reminder-tariffs.component.scss']
})
export class AdminReminderTariffsComponent implements OnInit {
  selection: any;
  tariffs: any;
  tableForm: any;
  responsiveTableHeader = false;
  tableSearch = false;
  tableLoaderIsVisible = false;
  displayedAllTariffsColumns = ['select', 'id', 'name'];
  @Output() selectedNewTariff = new EventEmitter<any>();
  @Input() allTariffs = [];
  @Input() selectedTariffs = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private formBuilder: FormBuilder,
              @Inject(LOCALE_ID) protected localeId: string) { }

  ngOnInit() {
    this.tableForm = this.formBuilder.group({
      tableSearch: [null]
    });
    this.tariffs = new MatTableDataSource<Element>(this.allTariffs);
    this.tariffs.paginator = this.paginator;
    this.selection = new SelectionModel<Element>(true, []);
    this.selectedTariffs.forEach((item) => {
      this.tariffs.data.forEach(tariffItem => {
        if ( tariffItem.TRFF_GROUP === item.TRFF_GROUP ) {
          this.selection.select(tariffItem);
        }
      });
    });
  }
  tableHeaderToggle() {
    this.responsiveTableHeader = !this.responsiveTableHeader;
  }
  tableSearchToggle() {
    this.tableSearch = !this.tableSearch;
    this.tariffs.data = this.allTariffs;
    if (this.tableForm.get('tableSearch').value !== '') {
      this.tableForm.get('tableSearch').setValue('');
    }
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tariffs.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.tariffs.data.forEach(row => this.selection.select(row));
  }
  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  assignTariff() {
    this.selectedNewTariff.emit(this.selection.selected);
  }
  startSearch(e) {
    const searchLanguageKey = this.localeId === 'en-US' ? 'TRFF_NAME_ENG' : 'TRFF_NAME_FR';
    this.tariffs.data = this.allTariffs;
    if ( e.target.value === '' ) {
      this.tariffs.data = this.allTariffs;
    } else {
      this.tariffs.data = this.tariffs.data.filter(item => {
        return item[searchLanguageKey].toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1;
      });
    }
  }
  initTable() {

  }
}
