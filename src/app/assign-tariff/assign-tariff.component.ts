import { Component, OnInit, ViewChild, Inject, LOCALE_ID } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { trigger } from '@angular/animations';
import {animationPopup, itemAnimation} from '../_shared/animations';
import { TariffsService } from './tariffs.service';
import { SnackBarComponent } from '../_shared/components/snack-bar/snack-bar.component';
import { finalize } from 'rxjs/operators';

@Component({
	selector: 'app-assign-tariff',
	templateUrl: './assign-tariff.component.html',
	animations: [
		trigger('itemAnimation', itemAnimation),
    trigger('animationPopup', animationPopup)
	]
})
export class AssignTariffComponent implements OnInit {
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	tariffs = new MatTableDataSource();
	assignedTariff = new MatTableDataSource([]);
	unitiArr = new MatTableDataSource([]);
	displayedColumns: string[] = ['TRFF_NAME_ENG'];
	displayedUnitiColumns: string[] = ['title', 'primary'];
	displayedColumnsUnit: string[] = ['name'];
	popupOpen: boolean;
	addUnitPopup: boolean;
	loaderIsVisible: boolean;
	loaderIsVisibleAssigned: boolean;
	loaderIsVisibleUnit: boolean;
	tariff: any = {};
	unitObj: any;
	assignTariffForm: FormGroup;
	@ViewChild('assignForm') assignForm;
	createUnitName = new FormControl('', [Validators.required]);
	@ViewChild(SnackBarComponent) snackComponent: SnackBarComponent;
	step = -1;
	step_trff = -1;
	assignedTariffName: string;
	textSuccess: string;
	serverError: boolean;
	impersionateModeError: boolean;
  unitNameExitPopUp = false;
  impersonationAssignTariffError = false;
  impersonateAssignLicenseError = false;
	constructor(private tariffsService: TariffsService, @Inject(LOCALE_ID) public localeId: string) {
		this.assignTariffForm = new FormGroup({
			'startDate': new FormControl(null, [Validators.required])
		});
		this.textSuccess = this.localeId === 'fr' ? 'Affectation de licence musicale réussie' : 'Music license successfully assigned';
	}

	ngOnInit() {
		this.tariffs.sort = this.sort;
		this.tariffs.paginator = this.paginator;
		this.getAssignedTariffs();
	}

	getAvaibleTariffs() {
		let tariffAvailable = [];
		this.loaderIsVisible = true;
		this.tariffsService.getAllTariffs()
			.pipe(finalize(() => {
				this.loaderIsVisible = false;
			}))
			.subscribe((data) => {
				if (this.assignedTariff.data.length) {
					data.forEach((item) => {

						//				  if (item.TRFF_GROUP == 80){
						//					 tarfAveible.push(item);
						//				  }

						tariffAvailable.push(item);
					});
					this.tariffs.data = this.compareTariff(tariffAvailable, this.assignedTariff.data);
				} else {
					data.forEach((item) => {

						//				  if (item.TRFF_GROUP == 80){
						//					 tarfAveible.push(item);
						//				  }

						tariffAvailable.push(item);
					});
					this.tariffs.data = tariffAvailable;
				}
			});
	}

	getAssignedTariffs() {
		let assignedTariff = [];
		this.loaderIsVisibleAssigned = false;
		this.tariffsService.assignedAllTariffs(0)
			.pipe(finalize(() => {
				this.loaderIsVisibleAssigned = false;
				this.getAvaibleTariffs();
			}))
			.subscribe((data) => {
				if (data) {
					//			  data.forEach((item)=>{
					//
					//				  if (item.TRFF_GROUP == 80){
					//					 assignedTariff.push(item);
					//				  }
					//			  });
					//			 this.assignedTariff = new MatTableDataSource(assignedTariff);
					this.assignedTariff = new MatTableDataSource(data);
				}
			});
	}

	compareTariff(arr1: any, arr2: any) {
		let reuslt = [];
		let onlyInA = arr1.filter(this.comparer(arr2));
		let onlyInB = arr2.filter(this.comparer(arr1));
		return reuslt = onlyInA.concat(onlyInB);
	}

	comparer(otherArray) {
		return function (current) {
			return otherArray.filter(function (other) {
				return other.TRFF_NAME_ENG == current.TRFF_NAME_ENG
			}).length == 0;
		}
	}

	assign(item: any) {
		this.popupOpen = true;
		this.tariff = item;
		if (this.localeId === 'fr') {
			this.assignedTariffName = item.TRFF_NAME_FR;
		} else {
			this.assignedTariffName = item.TRFF_NAME_ENG;
		}

	}

	consfirmAssign() {
		this.popupOpen = false;
		this.loaderIsVisibleAssigned = true;
		this.impersonateAssignLicenseError = false;
    this.serverError = false;
		this.tariffsService.assignTariff(this.assignTariffForm.value, this.tariff.TRFF_GROUP)
			.pipe(finalize(() => {
				this.loaderIsVisibleAssigned = false;
				this.assignForm.resetForm();
			}))
			.subscribe((data) => {
				if (data) {
					this.step = -1;
					this.step_trff = -1;
					this.getAssignedTariffs();
					this.snackComponent.openSnackBar(this.textSuccess);
				}
			}, (error) => {
				if (error.error.errorCode == 3) {
					this.impersonateAssignLicenseError = true;
				} else {
          this.serverError = true;
        }
			});
	}

	getUnit(TRFF_GROUP: string) {
		this.tariffsService.getUnit(TRFF_GROUP)
			.pipe(finalize(() => {
				this.loaderIsVisibleUnit = false;
			}))
			.subscribe((data) => {
        if (data) {
          this.unitiArr.data = [];
					this.unitiArr = new MatTableDataSource(data);
				}
			});
	}

	clearUnit() {
		this.loaderIsVisibleUnit = true;
		this.unitiArr = new MatTableDataSource([]);
	}

	addUnit(item: any) {
		this.addUnitPopup = true;
		this.unitObj = item;
	}

	confirmAddUnit() {
		this.addUnitPopup = false;
		this.loaderIsVisibleUnit = true;
    this.impersonationAssignTariffError = false;
    this.serverError = false;
		this.tariffsService.addUnit({ unitName: this.createUnitName.value }, this.unitObj.TRFF_GROUP)
			.pipe(finalize(() => {
				this.createUnitName.reset();
				this.loaderIsVisibleUnit = false;
			}))
			.subscribe((data) => {

        if ( data.errorCode === 1 ) {
          this.unitNameExitPopUp = true;
        } else if ( data === true ) {
          this.getUnit(this.unitObj.TRFF_GROUP);
        }
			}, (error) => {
				if (error.error.errorCode == 3) {
					this.impersonationAssignTariffError = true;
				} else {
          this.serverError = true;
        }
			});
	}

	setStep(index: number) {
		this.step = index;
	}
	setStepTrff(index: number) {
		this.step_trff = index;
		this.assignTariffForm.get('startDate').setValue(null);
		this.assignTariffForm.get('startDate').updateValueAndValidity();
	}


}
