import { Component, Input, Output, EventEmitter } from '@angular/core';
import { animationPopup } from '../../animations';
import { trigger } from '@angular/animations';

@Component({
    selector: 'app-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.css'],
    animations: [
        trigger('animationPopup', animationPopup)
    ]
})
export class PopupComponent {
    @Input('open') popupOpened: boolean = false;
    @Input('size') size: number = 1;
    @Output('close') popupClosed = new EventEmitter<boolean>();
    constructor() { }

    onPopupClose() {
        this.popupClosed.emit(false);
    }

}
