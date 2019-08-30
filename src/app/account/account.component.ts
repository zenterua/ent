import { Component, OnInit, ViewChild, Inject, LOCALE_ID, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { emailPattern } from '../_shared/validators/email.validator';
import { phonePattern } from '../_shared/validators/phone.validator';
import { patternCodeCanada } from '../_shared/validators/canada-postal-code.validator';
import { matchFieldsValidator } from '../_shared/validators/match-fields.validator';
import { passwordPattern } from '../_shared/validators/password.validator';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { AccountApiServices } from './account.api.services';
import { SnackBarComponent } from '../_shared/components/snack-bar/snack-bar.component';
import { LicensessService } from '../header/licensee.service';
import { AuthService } from '../_shared/services/auth.service';
import { Router } from '@angular/router';
import {trigger} from '@angular/animations';
import {animationPopup} from '../_shared/animations';

@Component({
	selector: 'app-account',
	templateUrl: './account.component.html',
  animations: [trigger('animationPopup', animationPopup)]
})
export class AccountComponent implements OnInit, OnDestroy {
	userData: any = {};
	ifPrimaryContact: boolean;
	editProfileForm: FormGroup;
	editProfileInfo: boolean;
	editEmailForm: FormGroup;
	editEmailInfo: boolean;
	editPasswordForm: FormGroup;
	editPasswordInfo: boolean;
	editContactForm: FormGroup;
	promotionEmailForm: FormGroup;
	addContactInfo: boolean;

	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator) paginator: MatPaginator;

	accountContacts = new MatTableDataSource([]);
	displayedColumns: string[] = ['CONTACT_FIRST_NAME', 'CONTACT_LAST_NAME', 'E_MAIL', 'EPR_PHONE_NO', 'menu'];
	loaderIsVisible: boolean;
	leftPart: boolean;
	rightPart: boolean;
	newContactForm: FormGroup;
	newContactInfo: boolean;
	noContacts: boolean;
	isPromaryEditedContact: boolean;
	contactEditId: any;
	@ViewChild('formNew') formNew;
	@ViewChild('formEdit') formEdit;
	textError: string;
	textSuccess: string;
	textSuccessPass: string;
	textSuccessEmail: string;
	textSuccessContact: string;
	textSuccessPrimary: string;
	textSuccessDelete: string;
	textErrorImpersionate: string;
	textErrorPromotionTrue;
	textErrorPromotionFalse;
	editedContact: number;
	searchValue: string;
	private userSub: Subscription;
	loaderIsVisiblePage: boolean;
  confirmDelateContact: boolean;
  contactId: number;
	@ViewChild(SnackBarComponent) snackComponent: SnackBarComponent;

	constructor(private accountApiServices: AccountApiServices, @Inject(LOCALE_ID) public localeId: string, private licensessService: LicensessService, private Auth: AuthService, private router: Router) {
		this.promotionEmailForm = new FormGroup({
			'promo': new FormControl(null, [Validators.required])
		});

		this.editProfileForm = new FormGroup({
			'BUSINESS_NAME': new FormControl(null, [Validators.required, Validators.maxLength(50)]),
			'ADDRESS': new FormControl(null, [Validators.required]),
			'PROVINCE': new FormControl(null, [Validators.required]),
			'CITY': new FormControl(null, [Validators.required]),
			'POSTAL_CODE': new FormControl(null, [Validators.required, Validators.pattern(patternCodeCanada)]),
			'PHONE': new FormControl(null, [Validators.required, Validators.pattern(phonePattern)])
		});

		this.editEmailForm = new FormGroup({
			'password': new FormControl(null, [Validators.required]),
			'email': new FormControl(null, [Validators.required, Validators.pattern(emailPattern)]),
			'oldEmail': new FormControl(null, [Validators.required, Validators.pattern(emailPattern)])
		});

		this.editPasswordForm = new FormGroup({
			'oldPassword': new FormControl(null, [Validators.required]),
			'password': new FormControl(null, [Validators.required, Validators.pattern(passwordPattern), Validators.maxLength(20)]),
			'passwordRepeat': new FormControl(null, [Validators.required])
		}, matchFieldsValidator('password', 'passwordRepeat'));

		this.editContactForm = new FormGroup({
			'firstName': new FormControl(null, [Validators.required]),
			'lastName': new FormControl(null, [Validators.required]),
			'email': new FormControl(null, [Validators.required, Validators.pattern(emailPattern)]),
			'phone': new FormControl(null, [Validators.required, Validators.pattern(phonePattern)]),
			'primary': new FormControl(null)
		});

		this.newContactForm = new FormGroup({
			'firstName': new FormControl(null, [Validators.required]),
			'lastName': new FormControl(null, [Validators.required]),
			'email': new FormControl(null, [Validators.required, Validators.pattern(emailPattern)]),
			'phone': new FormControl(null, [Validators.required, Validators.pattern(phonePattern)]),
			'primary': new FormControl(false)
		});

		if (this.localeId === 'fr') {
			this.textError = 'Une erreur s’est produite';
			this.textSuccess = 'Information de profil a été modifié avec succès !';
			this.textSuccessPass = 'Votre nouveau mot de passe a été créé avec succès !';
			this.textSuccessEmail = 'Nous vous avons envoyé un courriel de vérification';
			this.textSuccessContact = 'Le contact a été modifié avec succès !';
			this.textSuccessDelete = 'Le contact a été supprimé avec succès';
			this.textSuccessPrimary = 'Le contact principal a été modifié avec succès !';
			this.textErrorImpersionate = 'Vous ne pouvez pas effectuer cette action dans le mode mandataire';
			this.textErrorPromotionTrue = 'Vous avez souscrit';
			this.textErrorPromotionFalse = 'Vous avez désabonné';
		} else {
			this.textError = 'An Unexpected Error Occurred';
			this.textSuccess = 'Profile Information Successfully Changed';
			this.textSuccessPass = 'New password successfully created';
			this.textSuccessEmail = 'We have sent you a verification email';
			this.textSuccessContact = 'Contact Successfully Edited';
			this.textSuccessDelete = 'Contact Successfully Deleted';
			this.textSuccessPrimary = 'Primary Contact Successfully Edited';
			this.textErrorImpersionate = 'Action is not allowed in Impersonation mode';
			this.textErrorPromotionTrue = 'You subscribed';
			this.textErrorPromotionFalse = 'You unsubscribed';
		}
	}

	ngOnInit() {
		this.accountContacts.sort = this.sort;
		this.accountContacts.paginator = this.paginator;
		this.getUserData();
		this.getAllContacts();
	}

	getUserData() {
		this.userSub = this.licensessService.getInfo()
			.subscribe((value) => {
				if (value.USER_ID) {
					this.userData = value;
					if (value.RECEIVE_PROMO_EMAILS == 'N') {
						this.promotionEmailForm.get('promo').setValue(true);
					} else {
						this.promotionEmailForm.get('promo').setValue(false);
					}
				}
			});
	}

	ngOnDestroy() {
		if (this.userSub) { this.userSub.unsubscribe(); }
	}

	subsctibePromotional(event) {
		let numb = event.checked ? 'N' : 'Y';
		this.loaderIsVisiblePage = true;
		this.accountApiServices.setPromotion(numb)
			.pipe(finalize(() => {
				this.loaderIsVisiblePage = false;
			}))
			.subscribe((data) => {
				if (data) {
					if (numb == 'Y') {
						this.snackComponent.openSnackBar(this.textErrorPromotionTrue);
					} else {
						this.snackComponent.openSnackBar(this.textErrorPromotionFalse);
					}
				} else {
					this.snackComponent.openSnackBar(this.textError);
				}
			}, (error) => {
				if (error.error.errorCode == 3) {
					this.snackComponent.openSnackBar(this.textErrorImpersionate);
				} else {
					this.snackComponent.openSnackBar(this.textError);
				}
			});
	}

	applyFilter(filterValue: string) {
		this.accountContacts.filter = filterValue.trim().toLowerCase();
	}

	clearSearch() {
		this.accountContacts.filter = '';
		this.searchValue = '';
		this.leftPart = false;
	}

	getAllContacts() {
		this.loaderIsVisible = true;
		this.accountApiServices.getAllContacts()
			.pipe(finalize(() => {
				this.loaderIsVisible = false;
			}))
			.subscribe((data) => {
				if (data.length) {
					this.accountContacts.data = data;
					this.noContacts = false;
				} else {
					this.noContacts = true;
				}
			}, (error) => {
				this.noContacts = true;
				this.snackComponent.openSnackBar(this.textError);
			})
	}

	editAccountInfo() {
		this.editProfileInfo = true;
		this.editProfileForm.patchValue(this.userData);
		this.editProfileForm.updateValueAndValidity();
	}

	onSubmitEditProfileForm() {
		if (this.editProfileForm.valid) {
			this.editProfileInfo = false;
			this.loaderIsVisiblePage = true;
			let editObj = {
				establishmentName: this.editProfileForm.get('BUSINESS_NAME').value,
				establishmentStreet: this.editProfileForm.get('ADDRESS').value,
				establishmentProvince: this.editProfileForm.get('PROVINCE').value,
				establishmentCity: this.editProfileForm.get('CITY').value,
				establishmentPostalCode: this.editProfileForm.get('POSTAL_CODE').value,
				phone: this.editProfileForm.get('PHONE').value,
			}
			this.accountApiServices.editProfile(editObj)
				.pipe(finalize(() => {
					this.loaderIsVisiblePage = false;
				}))
				.subscribe((data) => {
					if (data) {
						this.userData.BUSINESS_NAME = editObj.establishmentName;
						this.userData.ADDRESS = editObj.establishmentStreet;
						this.userData.POSTAL_CODE = editObj.establishmentPostalCode;
						this.userData.CITY = editObj.establishmentCity;
						this.userData.PHONE = editObj.phone;
						this.userData.PROVINCE = editObj.establishmentProvince;
						this.snackComponent.openSnackBar(this.textSuccess);
					} else {
						this.snackComponent.openSnackBar(this.textError);
					}
				}, (error) => {
					if (error.error.errorCode == 3) {
						this.snackComponent.openSnackBar(this.textErrorImpersionate);
					} else {
						this.snackComponent.openSnackBar(this.textError);
					}
				});
		}
	}

	onSubmitEditPasswordForm() {
		if (this.editPasswordForm.valid) {
			this.editPasswordInfo = false;
			this.loaderIsVisiblePage = true;
			this.accountApiServices.editPassword(this.editPasswordForm.value)
				.pipe(finalize(() => {
					this.loaderIsVisiblePage = false;
				}))
				.subscribe((data) => {
					if (data) {
						this.snackComponent.openSnackBar(this.textSuccessPass);
					} else {
						this.snackComponent.openSnackBar(this.textError);
					}
				}, (error) => {
					if (error.error.errorCode == 3) {
						this.snackComponent.openSnackBar(this.textErrorImpersionate);
					} else {
						this.snackComponent.openSnackBar(this.textError);
					}
				});
		}
	}

	editEmailOpen() {
		this.editEmailInfo = true;
		this.editEmailForm.get('oldEmail').setValue(this.userData.EMAIL);
	}

	onSubmitEditEmailForm() {
		if (this.editEmailForm.valid) {
			this.editEmailInfo = false;
			this.loaderIsVisiblePage = true;
			this.accountApiServices.editEmail(this.editEmailForm.value, this.localeId == 'fr' ? 'F' : '')
				.pipe(finalize(() => {
					this.loaderIsVisiblePage = false;
				}))
				.subscribe((data) => {
					if (data) {
						this.snackComponent.openSnackBar(this.textSuccessEmail);
						this.Auth.clearData();
					} else {
						this.snackComponent.openSnackBar(this.textError);
					}
				}, (error) => {
					if (error.error.errorCode == 3) {
						this.snackComponent.openSnackBar(this.textErrorImpersionate);
					} else {
						this.snackComponent.openSnackBar(this.textError);
					}
				});
		}
	}

	setPrimary(primary) {
		if (primary == '1' && this.accountContacts.data) {
			this.accountContacts.data.forEach((item: any) => {
				if (item.PRIMARY_CONTACT == 'Y') {
					item.PRIMARY_CONTACT = 'N';
				}
			});
		}
	}

	setPrimaryContact(id, index) {
		this.loaderIsVisible = true;
		this.accountApiServices.setPrimaryContact(id)
			.pipe(finalize(() => {
				this.loaderIsVisible = false;
			}))
			.subscribe((data) => {
				if (data) {
					this.getAllContacts();
					this.snackComponent.openSnackBar(this.textSuccessPrimary);
				} else {
					this.snackComponent.openSnackBar(this.textError);
				}
			}, (error) => {
				if (error.error.errorCode == 3) {
					this.snackComponent.openSnackBar(this.textErrorImpersionate);
				} else {
					this.snackComponent.openSnackBar(this.textError);
				}
			});
	}

	editContact(item: any, index: any) {
		this.addContactInfo = true;
		this.editContactForm.get('firstName').setValue(item.CONTACT_FIRST_NAME);
		this.editContactForm.get('lastName').setValue(item.CONTACT_LAST_NAME);
		this.editContactForm.get('email').setValue(item.E_MAIL);
		this.editContactForm.get('phone').setValue(item.EPR_PHONE_NO);
		this.editContactForm.get('primary').setValue(item.PRIMARY_CONTACT == 'Y' ? 1 : 0);
		this.isPromaryEditedContact = item.PRIMARY_CONTACT == 'Y' ? false : true;
		this.contactEditId = item.CONTACT_ID;
		this.editedContact = index;
	}

	onEditContactForm() {
		if (this.editContactForm.valid) {
			this.loaderIsVisible = true;
			let isPrimary = this.editContactForm.get('primary').value ? '1' : '0';
			this.accountApiServices.editAccount(this.contactEditId, isPrimary, this.editContactForm.value)
				.pipe(finalize(() => {
					this.loaderIsVisible = false;
					this.addContactInfo = false;
					this.formEdit.resetForm();
				}))
				.subscribe((data) => {
					if (data) {
						this.snackComponent.openSnackBar(this.textSuccessContact);
						this.getAllContacts();
					} else {
						this.snackComponent.openSnackBar(this.textError);
					}
				}, (error) => {
					if (error.error.errorCode == 3) {
						this.snackComponent.openSnackBar(this.textErrorImpersionate);
					} else {
						this.snackComponent.openSnackBar(this.textError);
					}
				});
		}
	}

	deleteContact() {
		this.loaderIsVisible = true;
		this.accountApiServices.deleteAccount(this.contactId)
			.pipe(finalize(() => {
				this.loaderIsVisible = false;
			}))
			.subscribe((data) => {
				if (data) {
					this.getAllContacts();
					this.confirmDelateContact = false;
					this.snackComponent.openSnackBar(this.textSuccessDelete);
				} else {
					this.snackComponent.openSnackBar(this.textError);
				}
			}, (error) => {
				if (error.error.errorCode == 3) {
					this.snackComponent.openSnackBar(this.textErrorImpersionate);
				} else {
					this.snackComponent.openSnackBar(this.textError);
				}
			});
	}

	onSubmitNewContactForm() {
		if (this.newContactForm.valid) {
			let isPrimary = this.newContactForm.get('primary').value ? '1' : '0';
			this.newContactForm.get('primary').setValue(isPrimary);
			let newContact = {
				CONTACT_FIRST_NAME: this.newContactForm.get('firstName').value,
				CONTACT_LAST_NAME: this.newContactForm.get('lastName').value,
				E_MAIL: this.newContactForm.get('email').value,
				EPR_PHONE_NO: this.newContactForm.get('phone').value,
				PRIMARY_CONTACT: isPrimary == '1' ? 'Y' : 'N',
			};
			this.accountApiServices.addAccount(isPrimary, this.newContactForm.value)
				.pipe(finalize(() => {
					this.loaderIsVisible = false;
					this.newContactInfo = false;
					this.formNew.resetForm();
				}))
				.subscribe((data) => {
					if (data) {
						this.getAllContacts();
					} else {
						this.snackComponent.openSnackBar(this.textError);
					}
				}, (error) => {
					if (error.error.errorCode == 3) {
						this.snackComponent.openSnackBar(this.textErrorImpersionate);
					} else {
						this.snackComponent.openSnackBar(this.textError);
					}
				});
		}
	}
  confrimDelatePopup(contactId: number) {
    this.contactId = contactId;
	  this.confirmDelateContact = true;
  }

}
