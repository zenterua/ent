import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { phonePattern } from 'src/app/_shared/validators/phone.validator';
import { emailPattern } from 'src/app/_shared/validators/email.validator';
import { AdminOwnersService } from '../../admin.owners.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-admin-owner-create-account',
  templateUrl: './admin-owner-create-account.component.html',
  styleUrls: ['./admin-owner-create-account.component.scss']
})
export class AdminOwnerCreateAccountComponent implements OnInit {
  createOwner: FormGroup;
  loaderIsVisible = false;
  @Output() ownerCreated = new EventEmitter<any>();
  constructor(private adminOwnersService: AdminOwnersService) { }

  ngOnInit() {
    this.createOwner = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.pattern(emailPattern)]),
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      phoneNumber: new FormControl(null, [Validators.required, Validators.pattern(phonePattern)]),
      address: new FormControl(null, [Validators.required]),
      province: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      postalCode: new FormControl(null, [Validators.required]),
      businessName: new FormControl(null, [Validators.required])
    });
  }
  submitNewOwner() {
    this.loaderIsVisible = true;
    if (this.createOwner.valid) {
      this.adminOwnersService.createNewOwner(this.createOwner.value).pipe(
        finalize(() => {
          this.loaderIsVisible = false;
        })
      ).subscribe((response: any) => {
        if ( response ) {
          this.ownerCreated.emit(response);
        }
      }, (error) => {
        console.log(error);
        this.ownerCreated.emit(error);
      });
    }
  }
}
