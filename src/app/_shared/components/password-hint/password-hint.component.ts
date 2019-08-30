import { Component, OnInit, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-password-hint',
  templateUrl: './password-hint.component.html',
  encapsulation: ViewEncapsulation.None
})
export class PasswordHintComponent implements OnInit, OnDestroy {
    containsSpecialCharacter: boolean;
    containsLowercase: boolean;
    containsUppercase: boolean;
    containsNumber: boolean;
    containsLength: boolean;
    passwordSubscription: Subscription;
	@Input() password: FormControl;

    constructor() { }

    ngOnInit() {

	this.passwordSubscription = this.password.valueChanges.subscribe(value => {
		if (/[!@#\$%\^&\*]/g.test(value)) this.containsSpecialCharacter = true;
		else this.containsSpecialCharacter = false;
		if (/[a-z]/g.test(value)) this.containsLowercase = true;
		else this.containsLowercase = false;
		if (/[A-Z]/g.test(value)) this.containsUppercase = true;
		else this.containsUppercase = false;
		if (/[0-9]/g.test(value)) this.containsNumber = true;
		else this.containsNumber = false;
		if (/^.{8,20}$/g.test(value)) this.containsLength = true;
		else this.containsLength = false;
	  });
    }


    ngOnDestroy() {
        if(this.passwordSubscription) this.passwordSubscription.unsubscribe();
    }

}
