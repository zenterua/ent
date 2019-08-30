import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material';

@Component({
  selector: 'multi-select',
  templateUrl: "./multi-select.component.html",
  encapsulation: ViewEncapsulation.None
})
export class MultiSelectComponent {
  @Input() model: FormControl;
  @Input() values:any = {};
//  @Input() text = 'Select All';
  @Input() field:any = null;
  @Output() sendSelectedProvince = new EventEmitter<any>();

  isChecked(): boolean {
    return this.model.value && this.values.length
      &&  this.model.value.length === this.values.length;
  }

  isIndeterminate(): boolean {
    return this.model.value && this.values.length && this.model.value.length
      && this.model.value.length < this.values.length;
  }

  toggleSelection(change: MatCheckboxChange): void {
    if (change.checked) {
	  if (this.field){
		 let toggleArr = [];
		 this.values.forEach((i)=>{
			 toggleArr.push(i[this.field]);
		 });
		 this.model.setValue(toggleArr);
	  }else{
	    if ( this.values[0].alt ) {
        this.values = this.values.map(item => { // change for reminders detail provinces format
	        return item.alt;
        });
      }
      this.model.setValue(this.values);
      this.sendSelectedProvince.emit(this.values);
	  }
    } else {
      this.model.setValue([]);
      this.sendSelectedProvince.emit([]);
    }
  }
}
