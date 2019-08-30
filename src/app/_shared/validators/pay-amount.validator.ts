import { ValidatorFn, AbstractControl } from "@angular/forms";

export function payAmountValidator(control: AbstractControl): { [key: string]: any } | null {
	
	if (control.value !== undefined && +control.value > 10000) {
        return { 'maxAmount': true };
    }
    return null;
}