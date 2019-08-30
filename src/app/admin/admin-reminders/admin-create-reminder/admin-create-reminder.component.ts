import {Component, Inject, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {SnackBarComponent} from '../../../_shared/components/snack-bar/snack-bar.component';
import {AdminReminderService} from '../admin-reminder.service';
import {finalize} from 'rxjs/operators';
import {concat} from 'rxjs';
import {MaterialSearchComponent} from '../../../_shared/components/material-search/material-search.component';
import {Router} from '@angular/router';
import {animationPopup} from '../../../_shared/animations';
import {trigger} from '@angular/animations';

@Component({
  selector: 'app-admin-create-reminder',
  templateUrl: './admin-create-reminder.component.html',
  styleUrls: ['./admin-create-reminder.component.scss'],
  animations: [trigger('animationPopup', animationPopup)]
})
export class AdminCreateReminderComponent implements OnInit {
  tariffPopup = false;
  responsiveTableHeader = false;
  tableSearch = false;
  tableForm: FormGroup;
  reminderForm: FormGroup;
  reminderTemplates: any = [];
  previewTemplate = false;
  loaderIsVisible = false;
  @ViewChild(MatSort) selectedTariffSort: MatSort;
  @ViewChild('tariffTable', {read: MatSort}) tariffTableSort: MatSort;
  @ViewChild(SnackBarComponent) snackComponent: SnackBarComponent;
  @ViewChild(MaterialSearchComponent) materialSearch: MaterialSearchComponent;
  @ViewChild('templateForm') templateForm;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('remiForm') remiForm;
  removeTariffsSnack: string;
  assingNewTariffSnack: string;
  submitNewTemplateSnack: string;
  createdErrorSnack: string;
  closeRemoveConfirm = false;
  templateId: {id: number};
  reminderTemplate: FormGroup;
  reminderCreateTemplate = false;
  templateSpinner = false;
  selectedTemplate: {ID: number, TITLE: string, TEXT: string} | any;
  newReminder = false;
  displayedAllTariffsColumns = ['select', 'id', 'name'];
  selection: any;
  tariffsTableData: any;
  tariffs = [];
  allTariffs = [];
  province = [
    {value: 'Alberta', alt: 'AB' },
    {value: 'British Columbia', alt: 'BC'},
    {value: 'Manitoba', alt: 'MB'},
    {value: 'New Brunswick', alt: 'NB'},
    {value: 'Newfoundland and Labrador', alt: 'NL'},
    {value: 'Northwest Territories', alt: 'NT'},
    {value: 'Nova Scotia', alt: 'NS'},
    {value: 'Nunavut', alt: 'NU'},
    {value: 'Ontario', alt: 'ON'},
    {value: 'Prince Edward Island', alt: 'PE'},
    {value: 'Quebec', alt: 'QC'},
    {value: 'Saskatchewan', alt: 'SK'},
    {value: 'Yukon', alt: 'YT'}
    ];
  reminderCreatedSnac: string;
  reminderErorSnack: string;
  minEndDate: Date;
  currentDate: Date;
  nothingFound = false;
  constructor(private location: Location,
              private formBuilder: FormBuilder,
              @Inject(LOCALE_ID) protected localeId: string,
              private adminReminderService: AdminReminderService,
              private route: Router) {
  }
  ngOnInit() {
    if ( this.localeId === 'en-US' ) {
      this.reminderCreatedSnac = 'Reminder Successfully Created';
      this.removeTariffsSnack = 'Tariffs Successfully Removed';
      this.assingNewTariffSnack = 'Tariffs Successfully Assigned';
      this.submitNewTemplateSnack = 'Template Successfully Created';
      this.createdErrorSnack = 'Template Successfully Removed';
    } else {
      this.reminderErorSnack = 'Reminder Successfully Created';
      this.removeTariffsSnack = 'Tariffs Successfuly Removed FR';
      this.assingNewTariffSnack = 'Tariffs Successfully Assigned FR';
      this.submitNewTemplateSnack = 'Template Successfully Created FR';
      this.createdErrorSnack = 'Template Successfully Removed FR';
    }
    this.selection = new SelectionModel(true, []);
    this.tariffsTableData = new MatTableDataSource<Element>();
    this.tariffsTableData.paginator = this.paginator;
    this.tableForm = this.formBuilder.group({
      tableSearch: [null]
    });
    this.reminderForm = this.formBuilder.group({
      templates: [null, Validators.compose([Validators.required])],
      territories: [[], Validators.compose([Validators.required])],
      cadence: [null, Validators.compose([Validators.required])],
      startDate: [null, Validators.compose([Validators.required])],
      endDate: [null, Validators.compose([Validators.required])]
    });
    this.reminderTemplate = this.formBuilder.group({
      TITLE: [null, Validators.compose([Validators.required])],
      TEXT: [null, Validators.compose([Validators.required])]
    });
    this.materialSearch.searchForm.valueChanges.subscribe((response) => {
      this.selectedTemplate = {...response};
    });
    this.adminReminderService.getAllTemplates().pipe(
      finalize(() => {
        this.loaderIsVisible = false;
      })
    ).subscribe((response) => {
      this.reminderTemplates = response;
    }, (error) => {
      console.log(error);
    });
    this.adminReminderService.getReminderTariff().pipe(
      finalize(() => {
        this.loaderIsVisible = false;
      })
    ).subscribe((response: any) => {
      this.allTariffs = [...response];
    }, (error) => {
      console.log(error);
    });
    this.currentDate = new Date();
    this.minEndDate = new Date();
  }
  tableSearchToggle() {
    this.tableSearch = !this.tableSearch;
    this.tariffsTableData.data = this.tariffs;
    if (this.tableForm.get('tableSearch').value !== '') {
      this.tableForm.get('tableSearch').setValue('');
    }
  }
  tableHeaderToggle() {
    this.responsiveTableHeader = !this.responsiveTableHeader;
  }
  removeTariffs() {
    this.tariffsTableData.data = this.tariffs;
    this.tariffs = this.tariffsTableData.data.filter(itemTariff => {
      return this.selection.selected.indexOf(itemTariff) < 0;
    });
    this.tariffsTableData.data = this.tariffs;
    this.tableForm.get('tableSearch').setValue('');
    this.selection.clear();
    if ( !this.tariffsTableData.data.length ) {
      this.tariffs = [];
    }
  }
  createReminder() {
    const reminderData = {
      template: this.reminderForm.value.templates.ID,
      tariffs: this.tariffsTableData.data.map(item => {
        return item.TRFF_GROUP;
      }),
      cadence: this.reminderForm.value.cadence,
      startDate: this.reminderForm.value.startDate,
      endDate: this.reminderForm.value.endDate,
      province: this.reminderForm.value.territories.map(item => {
        return item;
      }),
      industry: 'indTest'
    };
    this.loaderIsVisible = true;
    this.adminReminderService.saveReminder(reminderData).pipe(
      finalize(() => {
        this.loaderIsVisible = false;
      })
    ).subscribe((response) => {
      this.snackComponent.openSnackBar(this.reminderCreatedSnac);
      this.route.navigate(['admin/reminders']);
      this.remiForm.resetForm();
      this.tariffsTableData.data = [];
      this.tariffs = [];
      this.materialSearch.searchForm.get('TITLE').setValue('');
      this.selectedTemplate = false;
    }, (error) => {
      console.log(error);
      this.snackComponent.openSnackBar(this.reminderErorSnack);
    });
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tariffsTableData.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.tariffsTableData.data.forEach(row => this.selection.select(row));
  }
  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  submitTemplate() {
    this.templateSpinner = true;
    const createTemplateData = {
      id: this.templateId ? this.templateId : null,
      title: this.reminderTemplate.value.TITLE,
      text: this.reminderTemplate.value.TEXT
    };
    concat(
      this.adminReminderService.saveTemplate(createTemplateData),
      this.adminReminderService.getAllTemplates().pipe(
        finalize(() => {
          this.templateSpinner = false;
        })
      )
    ).subscribe((response: any) => {
      if ( response === true) { // show message if template successfully submitted
        this.snackComponent.openSnackBar(this.submitNewTemplateSnack);
        this.templateForm.resetForm();
      }
      if ( response.length) { // refresh all templates list
        this.reminderTemplates = response;
      }
      this.reminderCreateTemplate = false;
    }, (error) => {
      console.log(error);
      this.templateSpinner = false;
    });
  }
  removeSingleTemplate() {
    this.loaderIsVisible = true;
    concat(
      this.adminReminderService.removeTemplate(this.templateId),
      this.adminReminderService.getAllTemplates().pipe(
        finalize(() => {
          this.loaderIsVisible = false;
        })
      )
    ).subscribe((response: any) => {
      if ( response === true) { // show message if template successfully removed
        this.snackComponent.openSnackBar(this.createdErrorSnack);
        this.materialSearch.searchForm.get('TITLE').setValue('');
      }
      if ( response.length) { // refresh all templates list
        this.reminderTemplates = response;
      }
      if ( !response.length ) { // remove last template
        this.reminderTemplates = [];
      }
      this.closeRemoveConfirm = false;
    }, (error) => {
      console.log(error);
      this.templateSpinner = false;
    });
  }
  getTemplateId(id) {
    this.templateId = id;
    this.closeRemoveConfirm = true;
    this.selectedTemplate = false;
  }
  editTemplate(templateData) {
    this.newReminder = false;
    this.templateId = templateData.ID;
    this.reminderTemplate.patchValue(templateData);
    this.selectedTemplate = false;
    this.reminderCreateTemplate = true;
  }
  showPreviewTemplate() {
    this.previewTemplate = true;
  }
  startCreatingTemplate() {
    this.newReminder = true;
    setTimeout(() => {
      this.templateForm.resetForm();
    }, 0);

    this.reminderCreateTemplate = true;
    this.templateId = null;
  }
  reminderTariffs(tariffs) {
    this.tariffs = [...tariffs];
    this.tariffsTableData.data = tariffs;
    this.tariffPopup = false;
  }
  startSearch(e) {
    const searchLanguageKey = this.localeId === 'en-US' ? 'TRFF_NAME_ENG' : 'TRFF_NAME_FR';
    this.tariffsTableData.data = this.tariffs;
    if ( e.target.value === '' ) {
      this.tariffsTableData.data = this.tariffs;
      this.nothingFound = false;
    } else {
      this.tariffsTableData.data = this.tariffsTableData.data.filter(item => {
        return item[searchLanguageKey].toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1;
      });
      this.tariffsTableData.data.length ? this.nothingFound = false : this.nothingFound = true;
    }
  }
  setEndDate(e) {
    this.minEndDate = e ? e : new Date();
  }
}
