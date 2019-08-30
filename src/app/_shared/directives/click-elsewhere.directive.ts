import { Directive, EventEmitter, ElementRef, HostListener, Output, HostBinding } from '@angular/core';

@Directive({ selector: '[clickElsewhere]' })
export class ClickElsewhereDirective {
    @Output() clickElsewhere = new EventEmitter<MouseEvent>();
    isClicked = true;

    constructor(private elementRef: ElementRef) { }

    //@HostBinding('class.active') isClicked = true;

    @HostListener('document:click', ['$event'])
    public onDocumentClick(event: MouseEvent): void {
        const targetElement = event.target as HTMLElement;

        // Check if the click was outside the element
        if (targetElement && !this.elementRef.nativeElement.contains(targetElement)) {
            this.isClicked = false;
            this.clickElsewhere.emit(event);
        }
        else{}
    }
}