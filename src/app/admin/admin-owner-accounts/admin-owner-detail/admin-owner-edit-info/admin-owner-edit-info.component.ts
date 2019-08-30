import { Component, OnInit, Input, OnChanges, AfterViewInit, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { phonePattern } from 'src/app/_shared/validators/phone.validator';
import { emailPattern } from 'src/app/_shared/validators/email.validator';
import { AdminOwnersService } from '../../admin.owners.service';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-admin-owner-edit-info',
  templateUrl: './admin-owner-edit-info.component.html',
  styleUrls: ['./admin-owner-edit-info.component.scss']
})
export class AdminOwnerEditInfoComponent implements OnInit {
  editOwner: FormGroup;
  userId: string;
  loaderIsVisible = false;
  @Output() ownerDataChanged = new EventEmitter<any>();
  @Input() ownerData: any = {};
  constructor(private adminOwnersService: AdminOwnersService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.userId = this.activatedRoute.snapshot.params.id;

    this.editOwner = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.pattern(emailPattern)]),
      'firstName': new FormControl(null, [Validators.required]),
      'lastName': new FormControl(null, [Validators.required]),
      'phoneNumber': new FormControl(null, [Validators.required, Validators.pattern(phonePattern)]),
      'address': new FormControl(null, [Validators.required]),
      'province': new FormControl(null, [Validators.required]),
      'city': new FormControl(null, [Validators.required]),
      'postalCode': new FormControl(null, [Validators.required]),
      'businessName': new FormControl(null, [Validators.required])
    });
    this.editOwner.patchValue(this.ownerData);
  }
  submitEditOwner() {
    if ( this.editOwner.valid ) {
      this.loaderIsVisible = true;
      const ownerData = {id: this.userId, ...this.editOwner.value}
      this.adminOwnersService.editOwnerData(ownerData).pipe(
        finalize(() => {
          this.loaderIsVisible = false;
        })
      ).subscribe((response) => {
        if ( response ) {
          this.ownerDataChanged.emit(response);
        }
      }, (error) => {
        console.log(error);
      })
    }
    
  }
}
