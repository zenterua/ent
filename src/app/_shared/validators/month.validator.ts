import { ValidatorFn, AbstractControl } from "@angular/forms";

export function dateCardValidator(control: AbstractControl): { [key: string]: any } | null {
	let currentYear = new Date().getFullYear().toString();
	let currentMonth = new Date().getMonth().toString();
	let selectedMonth;
	let selectedYear;
	let currentYearVal;
	if (control.value !== null && control.value !== undefined && control.value.length > 1){
		currentYearVal = currentYear.substring(2, 4);
		selectedMonth = control.value.substring(0, 2);
		selectedYear = control.value.substring(3, 5);
		if (currentYearVal == selectedYear){
			if ((+selectedYear < +currentYearVal) || (+selectedMonth < +currentMonth + 1) || (+selectedMonth > 12)){
				return { 'dateValid': true };
			}
		}else{
			if ((+selectedYear < +currentYearVal) || (+selectedMonth > 12)){
				return { 'dateValid': true };
			}
		}
	}
    return null;
}