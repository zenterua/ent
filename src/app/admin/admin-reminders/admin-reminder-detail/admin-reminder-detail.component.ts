import {Component, Inject, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackBarComponent} from '../../../_shared/components/snack-bar/snack-bar.component';
import {animationPopup, voidSlideUpDown} from '../../../_shared/animations';
import {trigger} from '@angular/animations';
import {MaterialSearchComponent} from '../../../_shared/components/material-search/material-search.component';
import {finalize, map} from 'rxjs/operators';
import {concat, forkJoin} from 'rxjs';
import {AdminReminderService} from '../admin-reminder.service';


@Component({
  selector: 'app-admin-reminder-detail',
  templateUrl: './admin-reminder-detail.component.html',
  animations: [trigger('voidSlideUpDown', voidSlideUpDown), trigger('animationPopup', animationPopup)]
  })
  export class AdminReminderDetailComponent implements OnInit {
  tariffPopup = false;
  responsiveTableHeader = false;
  tableSearch = false;
  tableForm: FormGroup;
  reminderForm: FormGroup;
  reminderTemplates: any = [];
  previewTemplate = false;
  loaderIsVisible = false;
  @ViewChild(MatSort) selectedTariffSort: MatSort;
  @ViewChild(MaterialSearchComponent) materialSearch: MaterialSearchComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(SnackBarComponent) snackComponent: SnackBarComponent;
  @ViewChild('templateForm') templateForm;
  @ViewChild('tariffTable', {read: MatSort}) tariffTableSort: MatSort;
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
  reminderCreatedSnac: string;
  reminderErorSnack: string;
  removeReminderConfirm = false;
  reminderRemovedSnack: string;
  reminderRemovedErrorSnack: string;
  reminderId: string;
  reminderUpdatedSnack: string;
  reminderUpdatedErrorSnack: string;
  nothingFound = false;
  minEndDate: Date;
  currentDate: Date;
  formChanged = false;
  constructor(private location: Location,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              @Inject(LOCALE_ID) protected localeId: string,
              private adminReminderService: AdminReminderService,
              private route: Router ) {
  }
  ngOnInit() {
    this.loaderIsVisible = true;
    if ( this.localeId === 'en-US' ) {
      this.reminderUpdatedSnack = 'Reminder Successfully Updated';
      this.reminderUpdatedErrorSnack = 'Reminder Update Unsuccessful';
      this.reminderRemovedSnack = 'Reminder Successfully Removed';
      this.reminderRemovedErrorSnack = 'Reminder Remove Unsuccessful';
      this.reminderCreatedSnac = 'Reminder Successfully Created';
      this.removeTariffsSnack = 'Tariffs Successfully Removed';
      this.assingNewTariffSnack = 'Tariffs Successfully Assigned';
      this.submitNewTemplateSnack = 'Template Successfully Created';
      this.createdErrorSnack = 'Template Successfully Removed';
    } else {
      this.reminderRemovedSnack = 'Reminder Successfully Removed FR';
      this.reminderRemovedErrorSnack = 'Reminder Remove Unsuccessful FR';
      this.reminderErorSnack = 'Reminder Successfully Created FR';
      this.removeTariffsSnack = 'Tariffs Successfuly Removed FR';
      this.assingNewTariffSnack = 'Tariffs Successfully Assigned FR';
      this.submitNewTemplateSnack = 'Template Successfully Created FR';
      this.createdErrorSnack = 'Template Successfully Removed FR';
    }
    this.reminderId = this.activatedRoute.snapshot.paramMap.get('id');
    this.selection = new SelectionModel(true, []);
    this.tariffsTableData = new MatTableDataSource<Element>();
    this.tariffsTableData.paginator = this.paginator;
    this.tableForm = this.formBuilder.group({
      tableSearch: [null]
    });
    this.reminderForm = this.formBuilder.group({
      templates: [null, Validators.compose([Validators.required])],
      PROVINCE: [[null], Validators.compose([Validators.required])],
      CADENCE: [null, Validators.compose([Validators.required])],
      START_DATE: [null, Validators.compose([Validators.required])],
      END_DATE: [null, Validators.compose([Validators.required])]
    });
    this.reminderTemplate = this.formBuilder.group({
      TITLE: [null, Validators.compose([Validators.required])],
      TEXT: [null, Validators.compose([Validators.required])]
    });
    this.materialSearch.searchForm.valueChanges.subscribe((response) => {
      this.selectedTemplate = {...response};
    });
    forkJoin(
      this.adminReminderService.getReminderTariff(),
      this.adminReminderService.getAllTemplates(),
      this.adminReminderService.getReminderInfo(this.reminderId).pipe(
        map((response: any) => {
          const tariffs = response.TARIFFS.split('|');
          const province = response.PROVINCE.split('|');
          response.PROVINCE = province.filter(item => {
            if ( item !== '' ) {
              return item;
            }
          } );
          response.TARIFFS = tariffs.filter(item => {
            if ( item !== '' ) {
              return item;
            }
          } );
          return response;
        })
      )
    ).subscribe((response: any) => {
      this.allTariffs = response[0];
      this.reminderTemplates = response[1];

      response[2].TARIFFS.forEach(tariffId => {
        this.allTariffs.forEach(tariff => {
          if ( tariffId == tariff.TRFF_GROUP ) {
            this.tariffs.push(tariff);
          }
        });
      });
      this.tariffsTableData.data = this.tariffs;
      this.reminderForm.patchValue(response[2]);
      const selectedTemplate = response[1].filter(template => {
        if ( template.ID === response[2].TEMPLATE_ID ) {
          return template;
        }
      });
      this.materialSearch.onSelect(selectedTemplate[0]);
      this.loaderIsVisible = false;
      this.reminderForm.valueChanges.subscribe(() => {
        this.formChanged = true;
      });
    }, (error) => {
      console.log(error);
      if ( error.error.error === 'Reminder not found') {
        this.route.navigate(['admin/reminders']);
      }
    });
    this.currentDate = new Date();
    this.minEndDate = new Date();
  }
  tableSearchToggle() {
    this.tableSearch = !this.tableSearch;
    this.tariffsTableData.data = this.tariffs;
    this.nothingFound = false;
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
    this.formChanged = true;
  }
  createReminder() {
    const reminderData = {
      id: this.reminderId,
      template: this.reminderForm.value.templates.ID,
      tariffs: this.tariffsTableData.data.map(item => {
        return item.TRFF_GROUP;
      }),
      cadence: this.reminderForm.value.CADENCE,
      startDate: this.reminderForm.value.START_DATE,
      endDate: this.reminderForm.value.END_DATE,
      province: this.reminderForm.value.PROVINCE.map(item => {
        return item;
      })
    };
    this.loaderIsVisible = true;
    this.adminReminderService.saveReminder(reminderData).pipe(
      finalize(() => {
        this.loaderIsVisible = false;
      })
    ).subscribe((response) => {
      this.snackComponent.openSnackBar(this.reminderUpdatedSnack);
    }, (error) => {
      console.log(error);
      this.snackComponent.openSnackBar(this.reminderUpdatedErrorSnack);
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
      this.tariffsTableData.data.forEach(row => {
        this.selection.select(row);
      });
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
    this.formChanged = true;
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
  removeReminder() {
    this.loaderIsVisible = true;
    this.adminReminderService.removeReminder({id: this.reminderId}).pipe(
      finalize(() => {
        this.loaderIsVisible = false;
      })
    ).subscribe((response: any ) => {
      this.removeReminderConfirm = false;
      this.snackComponent.openSnackBar(this.reminderRemovedSnack);
      this.route.navigate(['admin/reminders']);
    }, (error) => {
      console.log(error);
      this.snackComponent.openSnackBar(this.reminderRemovedErrorSnack);
    });
  }
  getNewProvince(e) {
    this.reminderForm.get('PROVINCE').setValue(e);
  }
  setEndDate(e) {
    this.minEndDate = e ? e : new Date();
  }
}
