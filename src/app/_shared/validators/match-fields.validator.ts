import { ValidatorFn, AbstractControl } from "@angular/forms";

export function matchFieldsValidator(controlName1, controlName2): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        let value1 = control.get(controlName1).value;
        let value2 = control.get(controlName2).value;
        if (value1 !== value2 || !value1) {
            control.get(controlName2).setErrors({ matchField: true })
        } else {
            control.get(controlName2).setErrors(null);
        }
        return null;
    };
}