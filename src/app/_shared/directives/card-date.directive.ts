import { Directive, HostListener, ElementRef, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[formControlName][cardDate]',
})
export class CardDateDirective {
    constructor(public ngControl: NgControl, private elementRef: ElementRef) { }

    ngOnInit() {
        this.onInputChange(this.elementRef.nativeElement.value, false);    
    }

    @HostListener('ngModelChange', ['$event'])
    onModelChange(event) {
        if (event){
           this.onInputChange(event, false); 
        }
    }

    @HostListener('keydown.backspace', ['$event'])
    keydownBackspace(event) {
        this.onInputChange(event.target.value, true);
    }

    onInputChange(event, backspace) {
        let newVal = event.replace(/\D/g, '');
		if (backspace) {
            newVal = newVal.substring(0, newVal.length);
        }
		
        if (newVal.length >= 3) {
			newVal = newVal.replace(/^(\d{0,2})/, '$1/');
		}
		if (newVal.length >= 6){
			newVal = newVal.substring(0, 5);
		}
        this.ngControl.valueAccessor.writeValue(newVal);
        this.ngControl.control.setValue(newVal, { emitModelToViewChange: false });
        this.elementRef.nativeElement.parentNode.classList.add('typed');
    }
}