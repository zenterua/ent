import { Component, forwardRef, ViewChild, ElementRef, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-add-value',
  templateUrl: './add-value.component.html',
  providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AddValueComponent),
            multi: true
        }
    ]	
})
export class AddValueComponent implements ControlValueAccessor  {
    @ViewChild('from') inputElementFrom: ElementRef;
    @Input() title: string;
    inputValue: string = '';
    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
	@Output() selectValue = new EventEmitter<any>();
	
    onAdd() {
		this.trigger.closeMenu();
		this.inputValue = this.inputElementFrom.nativeElement.value;
		this.onUpdate();
		this.onTouched();
    }
	
    closeMenu(){
	   this.trigger.closeMenu();
    }	
    
    onUpdate() {
        this.writeValue(this.inputValue);
		this.selectValue.emit(this.inputValue);
    }

    onChange = (value: string) => {
		
	};

    onTouched = () => { };

    writeValue(value: string): void {
		if (value){
			this.inputValue = value;
			this.inputElementFrom.nativeElement.value = value;
		}
	
        this.onChange(value);
    }

    registerOnChange(fn: () => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

}
