import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { trigger } from '@angular/animations';
import { itemAnimation } from '../../_shared/animations';
import { emailPattern } from '../../_shared/validators/email.validator';
import { map, finalize } from 'rxjs/operators';
import { portalApis } from '../portal.apis';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  animations: [trigger('itemAnimation', itemAnimation)]
})
export class ForgotpasswordComponent implements OnInit {
  loaderIsVisible: boolean;
  serverError: boolean;
  forgotForm: FormGroup;
  sendSuccess: boolean;

  constructor(private apis: portalApis, @Inject(LOCALE_ID) public localeId: string) {
    this.forgotForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.pattern(emailPattern)])
    });
  }

  ngOnInit() {

  }

  onSubmitForm() {
    this.loaderIsVisible = true;
    this.apis.forgotPassword(this.forgotForm.value, this.localeId == 'fr' ? 'F' : '')
      .pipe(
        finalize(() => {
          this.loaderIsVisible = false;
        })
      )
      .subscribe((data) => {
        this.sendSuccess = true;
        this.serverError = false;
      }, (err) => {
        this.sendSuccess = false;
        this.serverError = true;
      });
  }

}
