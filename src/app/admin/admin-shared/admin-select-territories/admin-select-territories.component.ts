import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-admin-select-territories',
  templateUrl: './admin-select-territories.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AdminSelectTerritoriesComponent),
      multi: true
    }
  ]
})
export class AdminSelectTerritoriesComponent implements OnInit, ControlValueAccessor {
  @Input() form: any;
  @Output() newProvince = new EventEmitter<any>();
  data: any;
  selectProvince: FormControl;
  province = [
    {value: 'Alberta', alt: 'AB'},
    {value: 'British Columbia', alt: 'BC'},
    {value: 'Manitoba', alt: 'MB'},
    {value: 'New Brunswick', alt: 'NB'},
    {value: 'Newfoundland and Labrador', alt: 'NL'},
    {value: 'Northwest Territories', alt: 'NT'},
    {value: 'Nova Scotia', alt: 'NS'},
    {value: 'Nunavut', alt: 'NU'},
    {value: 'Ontario', alt: 'ON'},
    {value: 'Prince Edward Island', alt: 'PE'},
    {value: 'Quebec', alt: 'QC'},
    {value: 'Saskatchewan', alt: 'SK'},
    {value: 'Yukon', alt: 'YT'}
  ];
  constructor() { }

  ngOnInit() {
    this.selectProvince = new FormControl(null);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(value: any): void {
    if (value) {
      this.data = value;
      this.selectProvince.patchValue(this.data);
    } else if (!value) {
      this.data = [];
    }
    this.onChange(value);
  }

  onChange = (value: any) => {}

  onTouched = () => { };

  updateProvince(e) {
    this.selectProvince.patchValue(e.value);
    this.newProvince.emit(e.value);
  }
  updateMultiProvince(e) {
    this.newProvince.emit(e);
  }
}
