import {Component, forwardRef, Input, ElementRef, ViewChild, EventEmitter, Output} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { formatDate } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
//import { MomentDateAdapter } from '@angular/material-moment-adapter';
//import * as _moment from 'moment';
//import { default as _rollupMoment } from 'moment';
//const moment = _rollupMoment || _moment;

//export const MY_FORMATS = {
//  parse: {
//    dateInput: 'LL',
//  },
//  display: {
//    dateInput: 'LL',
//    monthYearLabel: 'MMM YYYY',
//    dateA11yLabel: 'LL',
//    monthYearA11yLabel: 'MMMM YYYY',
//  },
//};
@Component({
    selector: 'app-datepicker',
    templateUrl: './datepicker.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DatepickerComponent),
            multi: true
        },
//		{provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
//		{provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ]
})
export class DatepickerComponent implements ControlValueAccessor {
    @Input() title: string;
    @Input() min: Date = null;
    @Input() max: Date = null;
    @Input() isDisabled: boolean = false;
    @Input() startAt:any = new Date();
    @Input() filter: boolean = false;
    @Input() set checkDates(data) {
      const startDate = new Date(data).getTime();
      const endDate = new Date(this.inputValue).getTime();
      if ( this.inputValue && startDate > endDate) {
        this.clearValue();
      }
    }
    @ViewChild('f') element: MatInput;
    @Output() selectedDate = new EventEmitter<any>();
	hideIcon:boolean;
	inputValue: Date = null;
    pickerOpened: boolean = false;

    onDateChanged(event: any) {
        this.writeValue(event.value);
    }
    onPickerOpened() {
        this.pickerOpened = true;
		setTimeout(_ => {
			this.element.focused = true;
		});
        this.onTouched();
    }
    onPickerClosed() {
        this.pickerOpened = false;
    }
    onChange = (value: string) => {

	};

    onTouched = () => { };

    writeValue(value: Date): void {
        let date = (value) ? formatDate(value, 'yyyy-MM-dd', 'en-US') : null;
		this.inputValue = new Date(date + 'T00:00:00');
      this.selectedDate.emit(date);
		if (this.filter && value){
			this.hideIcon = true;
		}else{
			this.hideIcon = false;
		}
        this.onChange(date);
    }

    registerOnChange(fn: () => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    clearValue(){
      this.writeValue(null);
    }

}
