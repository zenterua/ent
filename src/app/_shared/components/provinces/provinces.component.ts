import { Component, forwardRef, Input, ElementRef, ViewChild } from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, FormGroup} from '@angular/forms';
import { formatDate } from '@angular/common';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-provinces',
  templateUrl: './provinces.component.html',
  providers: [
	{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => ProvincesComponent),
		multi: true
	}
  ]
})
export class ProvincesComponent implements ControlValueAccessor {
  @Input() title: string;
  @Input() isrequired: boolean = true;
  @ViewChild('addProv') addProv: FormGroup;
  @ViewChild('matSelect') matSelect: any;
  hideIcon = true;
  selectedValue = new FormControl(null);
  constructor() {

  }

    onUpdate() {
	    this.writeValue(this.selectedValue.value);
    }

    onSelect() {
		this.writeValue(this.selectedValue.value);
    }

    onChange = (value: string) => { };

    onTouched = () => { };

    writeValue(value: string): void {
		if (value){
			this.selectedValue.setValue(value);
		}else{
			this.selectedValue.reset();
		}
        this.onChange(value);
    }

    registerOnChange(fn: () => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

  clearValue() {
     this.addProv.reset();
     this.selectedValue.setValue(null);
     this.onChange(null);
  }

}
