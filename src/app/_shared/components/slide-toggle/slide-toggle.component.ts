import { Component, OnInit, Input } from '@angular/core';
import { animate, transition, style, state, trigger } from '@angular/animations';
import { slideUpDown } from '../../../_shared/animations';

@Component({
    selector: 'app-slide-toggle',
    templateUrl: './slide-toggle.component.html',
    animations: [trigger('slideUpDown', slideUpDown)]  
})
export class SlideToggleComponent implements OnInit {
    @Input() slideVisible: boolean = true;
    constructor() { }

    ngOnInit() {
    }

    onToggle() {
        this.slideVisible = !this.slideVisible;
    }

}
