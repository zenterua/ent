import {Component, forwardRef, ViewChild, ElementRef, Input, Output, EventEmitter} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-material-search',
  templateUrl: './material-search.component.html',
  styles: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MaterialSearchComponent),
      multi: true
    }
  ]
  })
  export class MaterialSearchComponent implements ControlValueAccessor {
  searchForm: FormGroup;
  tableSearch = false;
  @ViewChild('f') inputElement: ElementRef;
  @Input() title: string;
  @Input() clearInput: boolean;
  @Output() removeTemplate = new EventEmitter<{id: number}>();
  @Output() editTemplate = new EventEmitter<{id: number}>();
  @Output() createTemplate = new EventEmitter<boolean>();
  _items: any[];
  get items(): any[] {
    return this._items;
  }
  @Input('items') set items(value: any[]) {
    this._items = value;
    this.itemsOriginal = value;
  }
  itemsOriginal: any[] = [];
  pickerOpened = false;
  constructor() {
    this.searchForm = new FormGroup({
      TITLE: new FormControl(null),
      ID: new FormControl(null),
      TEXT: new FormControl(null)
    });
  }
  onOpen() {
    this.pickerOpened = true;
  }
  onClose() {
    this.pickerOpened = false;
    this.itemsOriginal = this.items;
  }
  onSelect(value: {TITLE: string, ID: number, TEXT: string}) {
    this.searchForm.patchValue(value);
    this.onClose();
    this.onTouched();
    this.onChange(value);
  }
  onSearch(value: string) {
    this.itemsOriginal = this.items.filter( it => {
      return it.TITLE.toLowerCase().includes(value.toLowerCase());
    });
  }
  onChange = (value: {}) => { };
  onTouched = () => { };
  writeValue(value: string): void {
    this.onChange(value);
  }
  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  addNewTemplate() {
    this.createTemplate.emit(true);
  }
  removeReminders(item) {
    this.searchForm.get('TITLE').reset();
    this.removeTemplate.emit({id: item.ID});
  }
  editReminders(item) {
    this.searchForm.get('TITLE').reset();
    this.editTemplate.emit(item);
  }
}
