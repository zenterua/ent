import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

/*Custome Components*/

import { LanguagesComponent } from '../languages/languages.component';
import { PopupComponent } from '../_shared/components/popup/popup.component';
import { DatepickerComponent } from '../_shared/components/datepicker/datepicker.component';
import { SlideToggleComponent } from '../_shared/components/slide-toggle/slide-toggle.component';
import { BackButtonComponent } from '../_shared/components/back-button/back-button.component';
import { MultiSelectComponent } from '../_shared/components/multi-select/multi-select.component';
import { PasswordHintComponent } from './components/password-hint/password-hint.component';
import { AddValueComponent } from './components/add-value/add-value.component';
import { MaterialSearchComponent } from './components/material-search/material-search.component';
import { SnackBarComponent } from './components/snack-bar/snack-bar.component';

/*Custome Directives*/

import { CardDateDirective } from '../_shared/directives/card-date.directive';
import { NumberDirective } from '../_shared/directives/numbers-only.directive';
import { ClickElsewhereDirective } from './directives/click-elsewhere.directive';

/*Pipes*/

import { ContainPipe } from '../_shared/pipes/array.slice';

/*Angular Material Components*/

import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ProvincesComponent } from './components/provinces/provinces.component';

@NgModule({
  declarations: [
	PopupComponent,
	DatepickerComponent,
	SlideToggleComponent,
	BackButtonComponent,
	MultiSelectComponent,
	LanguagesComponent,
	PasswordHintComponent,
	CardDateDirective,
	NumberDirective,  
	ContainPipe,
	SnackBarComponent,
	MaterialSearchComponent,
	ClickElsewhereDirective,
	AddValueComponent,
	ProvincesComponent  
  ],
  imports: [
    CommonModule,
	ReactiveFormsModule,
    FormsModule, 
	RouterModule,  
	  
	MatInputModule,
	MatRadioModule,
	MatCheckboxModule,
	MatIconModule,
	MatSelectModule,
	MatMenuModule,
	MatDatepickerModule,
	MatPaginatorModule,
	MatSortModule,
	MatTableModule,
    MatNativeDateModule,
	MatExpansionModule,
	MatSnackBarModule  

  ],
  exports: [
	CommonModule,
	ReactiveFormsModule,
    FormsModule, 
	RouterModule, 
	  
	PopupComponent,
	DatepickerComponent,
	SlideToggleComponent,
	BackButtonComponent,
	MultiSelectComponent,
	LanguagesComponent,
	PasswordHintComponent,
	ProvincesComponent,  
	  
	CardDateDirective,
	NumberDirective,  
	ContainPipe,  
	  
	MatInputModule,
	MatRadioModule,
	MatCheckboxModule,
	MatIconModule,
	MatSelectModule,
	MatMenuModule,
	MatDatepickerModule,
	MatPaginatorModule,
	MatSortModule,
	MatTableModule,
    MatNativeDateModule,
	MatExpansionModule,
	SnackBarComponent,
	MatSnackBarModule,
	MaterialSearchComponent,
	ClickElsewhereDirective,
	AddValueComponent  
 
  ]	
})
export class SharedModule { }
