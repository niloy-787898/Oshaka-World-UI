import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {NgxSpinnerService} from 'ngx-spinner';

import {AngularFireAuth} from '@angular/fire/auth';

import {Router} from '@angular/router';
import firebase from 'firebase';
import {VendorService} from "../../../services/common/vendor.service";
import {UiService} from "../../../services/core/ui.service";
import {UtilsService} from "../../../services/core/utils.service";
import {WindowService} from "../../../services/common/window.service";
import {Vendor} from "../../../interfaces/common/vendor";


@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss']
})
export class StepOneComponent implements OnInit {

  @Output() done = new EventEmitter();

  baseVendorUrl = environment.vendorBaseUrl;

  public formData: FormGroup;
  isPhoneReg = true;
  isEmailReg = false;


  isHiddenPass = true;
  isHiddenConPass = true;

  // Phone Verification
  timeInstance = null;
  countDown = 0;
  windowRef: any;
  // verificationCode: string;
  public sendVerificationCode = false;
  public showVerificationCodeField = false;
  phoneMatched = false;
  storedPhoneNo: string = null;
  otpMatched: boolean = null;

  constructor(
    private vendorService: VendorService,
    private uiService: UiService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    public utilsService: UtilsService,
    private afAuth: AngularFireAuth,
    private win: WindowService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.windowRef = this.win.windowRef;

    this.formData = this.fb.group({
      email: [null, Validators.required],
      phoneNo: [null, Validators.required],
      otpCode: [null],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required],
      vendorName: [null, Validators.required],
    });
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit() {
    setTimeout(() => {
      this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container',
        {
          size: 'invisible'
        });
    }, 500);

  }

  /**
   * SENT OTP TO PHONE
   */
  onSentOtp() {
    if (!this.formData.value.phoneNo) {
      this.phoneNo.markAsTouched({onlySelf: true});
      this.uiService.warn('No phone number provided');
      return;
    }

    this.checkAndGetUserByPhone();
  }


  onSubmitForm() {
    if (this.formData.invalid) {
      return;
    }

    if (this.formData.value.password !== this.formData.value.confirmPassword) {
      this.uiService.warn('Password and confirm password not matched');
      return;
    }

    if (this.isEmailReg && !this.formData.value.email) {
      this.uiService.warn('Must provide an valid email');
      return;
    }

    this.spinner.show();

    const mData = {
      vendorSlug: this.utilsService.convertStringToSlug(this.formData.value.vendorName),
      username: this.formData.value.phoneNo,
      isPhoneVerified: this.otpMatched ? this.otpMatched : false,
      isEmailVerified: false,
    };

    const finalData: Vendor = {...this.formData.value, ...mData};
    console.log(finalData);

    this.vendorService.vendorRegistration(finalData)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.spinner.hide();
        this.router.navigate(['/', this.baseVendorUrl, 'login']);
      }, error => {
        this.spinner.hide();
        console.log(error);
      });

  }

  /**
   * HTTP REQ HANDLE
   */

  private checkAndGetUserByPhone() {
    this.storedPhoneNo = this.formData.value.phoneNo;
    console.log('this is in checkAndGetUserByPhone');
    this.vendorService.checkAndGetVendorByPhone(this.storedPhoneNo)
      .subscribe(res => {
        console.log('this is in before Status');
        const status = res.data;
        console.log('this is in after Status');
        if (!status) {
          this.phoneMatched = true;
          console.log('this is in phoneMatcher True');
          this.sendLoginCode();
        } else {
          this.uiService.warn('This phone no is already registered');
        }
      }, error => {
        console.log(error);
      });
  }

  /**
   * PHONE VERIFICATION
   */

  // Send Code..
  sendLoginCode() {

    const phoneNo = this.storedPhoneNo.trim();
    let finalPhoneNo: string;
    const appVerifier = this.windowRef.recaptchaVerifier;

    const checkDigit = phoneNo.substring(0, 3);
    if (checkDigit === '+88') {
      finalPhoneNo = phoneNo;
    } else {
      finalPhoneNo = '+88' + phoneNo;
    }

    console.log(finalPhoneNo);

    this.afAuth.signInWithPhoneNumber(finalPhoneNo, appVerifier)
      .then(result => {
        this.showVerificationCodeField = true;
        this.sendVerificationCode = true;
        this.windowRef.confirmationResult = result;
        this.uiService.success('Verification Otp has been sent.');
        this.countTime(60);

      })
      .catch(error => {
        console.log(error);
        // console.log('Error!!!');
        this.uiService.warn(error.message);
        // console.log(error);
        // this.uiService.showToastMessage('Something went wrong! Please try again.');
      });


  }

  // Resent Verification Code...
  resendLoginCode() {
    clearInterval(this.timeInstance);
    this.sendLoginCode();
  }

  // Verify Code..
  verifyOtpCode() {
    this.windowRef.confirmationResult
      .confirm(this.formData.value.otpCode)
      .then(() => {
        this.otpMatched = true;
        // Reset Value..
        this.showVerificationCodeField = false;
        this.sendVerificationCode = false;
        this.windowRef.confirmationResult = null;
        this.uiService.success('Phone verification success');
        clearInterval(this.timeInstance);
      })
      .catch(error => this.uiService.wrong('ERROR Code! Incorrect code entered?'));
  }

  // CountDown...
  countTime(time?) {
    const count = (num) => () => {
      this.countDown = num;
      num = num === 0 ? 0 : num - 1;
      if (num <= 0) {
        clearInterval(this.timeInstance);
        this.countDown = 0;
      }
    };

    this.timeInstance = setInterval(count(time), 1000);
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    if (this.timeInstance !== null && this.timeInstance !== undefined) {
      clearInterval(this.timeInstance);
    }

    this.otpMatched = false;
  }

  // get disableSubmit() {
  //   if (this.formData.valid && this.formData.value.agree) {
  //     if (this.isPhoneReg && this.formData.value.phoneNo) {
  //       if (this.otpMatched) {
  //         return false;
  //       } else {
  //         return true;
  //       }
  //     }
  //   } else {
  //     return true;
  //   }
  // }

  /**
   * Form Validations
   */
  get phoneNo() {
    return this.formData.get('phoneNo');
  }

  get email() {
    return this.formData.get('email');
  }

  get vendorName() {
    return this.formData.get('vendorName');
  }

  get password() {
    return this.formData.get('password');
  }

  get confirmPassword() {
    return this.formData.get('confirmPassword');
  }

  get otpCode() {
    return this.formData.get('otpCode');
  }


}
