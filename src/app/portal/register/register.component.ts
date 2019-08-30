import { Component, OnInit, OnDestroy, Inject, LOCALE_ID } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { trigger } from '@angular/animations';
import { itemAnimation } from '../../_shared/animations';
import { emailPattern } from '../../_shared/validators/email.validator';
import { phonePattern } from '../../_shared/validators/phone.validator';
import { matchFieldsValidator } from '../../_shared/validators/match-fields.validator';
import { passwordPattern } from '../../_shared/validators/password.validator';
import { UniqueEmailValidator } from '../../_shared/validators/unique-email.validator';
import { UniquUserValidator } from '../../_shared/validators/unique-new-user.validator';
import { patternCodeCanada } from '../../_shared/validators/canada-postal-code.validator';
import { map, finalize } from 'rxjs/operators';
import { portalApis } from '../portal.apis';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	animations: [trigger('itemAnimation', itemAnimation)]
})
export class RegisterComponent implements OnInit, OnDestroy {
	registerForm: FormGroup;
	registerTypeForm: FormGroup;
	registerMemberForm: FormGroup;
	registerSuccess: boolean;
	serverError: boolean;
	loaderIsVisible: boolean;
	resendEmail: boolean;
	errorAccount: boolean;
	selectLicensee: Subscription;
	aelectHearAbout: Subscription;
	azureId: any;
	isHideShow: boolean = false;
	passwordVisible: boolean;

	constructor(private apis: portalApis, private uniqueEmailValidator: UniqueEmailValidator, private uniqueUserValidator: UniquUserValidator, @Inject(LOCALE_ID) public localeId: string) {

		if (this.isHideShow) { this.passwordVisible = true; }

		this.registerTypeForm = new FormGroup({
			'chooseType': new FormControl('new', [Validators.required])
		});

		this.registerMemberForm = new FormGroup({
			'email': new FormControl(null, {
				validators: [Validators.required],
				asyncValidators: this.uniqueEmailValidator.validate.bind(this.uniqueEmailValidator),
				updateOn: 'blur'
			}),
			'hearAbout': new FormControl(null, [Validators.required]),
			'hearAboutOther': new FormControl(null),
			'password': new FormControl(null, [Validators.required, Validators.pattern(passwordPattern)]),
			'passwordRepeat': new FormControl(null, Validators.required)
		}, matchFieldsValidator('password', 'passwordRepeat'));

		this.registerForm = new FormGroup({
			'hearAbout': new FormControl(null, [Validators.required]),
			'lang': new FormControl(this.localeId == 'fr' ? 'F' : 'E', [Validators.required]),
			'hearAboutOther': new FormControl(null),
			'mailingEnable': new FormControl(false),
			'establishmentName': new FormControl(null, [Validators.required, Validators.maxLength(50)]),
			'establishmentStreet': new FormControl(null, [Validators.required]),
			'establishmentProvince': new FormControl(null, [Validators.required]),
			'establishmentCity': new FormControl(null, [Validators.required]),
			'establishmentPostalCode': new FormControl(null, [Validators.required, Validators.pattern(patternCodeCanada)]),
			'mailingStreet': new FormControl(null),
			'mailingProvince': new FormControl(null),
			'mailingCity': new FormControl(null),
			'mailingPostalCode': new FormControl(null),
			'firstName': new FormControl(null, [Validators.required]),
			'lastName': new FormControl(null, [Validators.required]),
			'email': new FormControl(null, {
				validators: [Validators.required, Validators.pattern(emailPattern)],
				asyncValidators: this.uniqueUserValidator.validate.bind(this.uniqueUserValidator),
				updateOn: 'blur'
			}),
			'phone': new FormControl(null, [Validators.required, Validators.pattern(phonePattern)]),
			'fax': new FormControl(''),
			'password': new FormControl(null, [Validators.required, Validators.pattern(passwordPattern)]),
			'passwordRepeat': new FormControl(null, Validators.required)
		}, matchFieldsValidator('password', 'passwordRepeat'));

	}

	ngOnInit() {
		this.selectLicensee = this.registerForm.get('mailingEnable').valueChanges.subscribe(value => {
			let mail: any = this.registerForm;
			if (value === true) {
				this.registerForm.get('mailingStreet').setValidators(Validators.required);
				this.registerForm.get('mailingProvince').setValidators(Validators.required);
				this.registerForm.get('mailingCity').setValidators(Validators.required);
				this.registerForm.get('mailingPostalCode').setValidators([Validators.required, Validators.pattern(patternCodeCanada)]);
			} else {
				this.registerForm.get('mailingStreet').clearValidators();
				this.registerForm.get('mailingStreet').setValue(null);
				this.registerForm.get('mailingProvince').clearValidators();
				this.registerForm.get('mailingProvince').setValue(null);
				this.registerForm.get('mailingCity').clearValidators();
				this.registerForm.get('mailingCity').setValue(null);
				this.registerForm.get('mailingPostalCode').clearValidators();
				this.registerForm.get('mailingPostalCode').setValue(null);
			}
		});
	}

	showPassword() {
		this.passwordVisible = !this.passwordVisible;
	}

	ngOnDestroy() {
		if (this.selectLicensee) this.selectLicensee.unsubscribe();
		if (this.aelectHearAbout) this.aelectHearAbout.unsubscribe();
	}

	onSubmitForm() {
		this.serverError = false;
		this.loaderIsVisible = true;
		if (this.registerForm.valid) {
			this.apis.registration(this.registerForm.value)
				.pipe(
					finalize(() => {
						this.loaderIsVisible = false;
					})
				)
				.subscribe((data) => {
					if (data) {
						this.azureId = data;
						this.registerSuccess = true;
					}
				}, (err) => {
					this.registerSuccess = false;
					this.serverError = true;
				})
		}
	}

	resendLink() {
		this.loaderIsVisible = true;
		this.apis.resendRegistrationConfirm(this.azureId, this.localeId == 'fr' ? 'F' : '').pipe(
			finalize(() => {
				this.loaderIsVisible = false;
			})
		)
			.subscribe((data) => {
				if (data) {
					this.registerSuccess = true;
					this.resendEmail = true;
				}
			}, (err) => {
				this.registerSuccess = false;
				this.serverError = true;
				this.resendEmail = false;
			});
	}

	onSubmitRegisterMemberForm() {
		this.serverError = false;
		this.loaderIsVisible = true;
		if (this.registerMemberForm.valid) {
			this.apis.registrationMembers(this.registerMemberForm.value)
				.pipe(finalize(() => {
					this.loaderIsVisible = false;
				}))
				.subscribe((data) => {
					if (data) {
						this.azureId = data;
						this.registerSuccess = true;
					}
				}, (err) => {
					if (err.error.errorCode == '1') {
						this.errorAccount = true;
					} else {
						this.registerSuccess = false;
						this.serverError = true;
						this.errorAccount = false;
					}
				});
		}
	}


}
