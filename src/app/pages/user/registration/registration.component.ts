import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {UtilsService} from '../../../services/core/utils.service';
import {UiService} from '../../../services/core/ui.service';
import {UserService} from '../../../services/common/user.service';
import {User} from "../../../interfaces/common/user.interface";
import firebase from "firebase";
import {AngularFireAuth} from "@angular/fire/auth";
import {WindowService} from "../../../services/common/window.service";
import auth = firebase.auth;

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

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
    public userService: UserService,
    private uiService: UiService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    public utilsService: UtilsService,
    private afAuth: AngularFireAuth,
    private win: WindowService,
  ) {
  }

  ngOnInit(): void {

    this.windowRef = this.win.windowRef;

    this.formData = this.fb.group({
      email: [null],
      phoneNo: [null],
      otpCode: [null],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required],
      birthDate: [null, Validators.required],
      birthMonth: [null, Validators.required],
      birthYear: [null, Validators.required],
      fullName: [null, Validators.required],
      gender: [null, Validators.required],
      agree: [true, Validators.required],
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.windowRef.recaptchaVerifier = new auth.RecaptchaVerifier('recaptcha-container',
        {
          size: 'invisible'
        });
    }, 500);

  }

  /**
   * TOGGLE REG TYPE
   */
  onToggleRegType() {
    if (this.isPhoneReg) {
      this.isEmailReg = true;
      this.isPhoneReg = false;
    } else {
      this.isEmailReg = false;
      this.isPhoneReg = true;
    }
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

    // Store Date Data
    const year = +this.formData.value.birthYear;
    const date = +this.formData.value.birthDate;
    const month = +this.formData.value.birthMonth;
    const buildDate = new Date(year, month, date);

    const data: User = {
      fullName: this.formData.value.fullName,
      phoneNo: this.isPhoneReg ? this.formData.value.phoneNo : null,
      email: this.isEmailReg ? this.formData.value.email : null,
      password: this.formData.value.password,
      birthdate: this.utilsService.getDateWithCurrentTime(buildDate),
      gender: this.formData.value.gender,
      isPhoneVerified: this.otpMatched ? this.otpMatched : false,
      registrationType: this.isPhoneReg ? 'phone' : 'email',
      isEmailVerified: false,
      hasAccess: true,
      username: this.isPhoneReg ? this.formData.value.phoneNo : this.formData.value.email,
    };

    this.userService.userRegistration(data);

  }


  /**
   * HTTP REQ HANDLE
   */

  private checkAndGetUserByPhone() {
    this.storedPhoneNo = this.formData.value.phoneNo;
    this.userService.checkAndGetUserByPhone(this.storedPhoneNo)
      .subscribe(res => {
        console.log(res);
        const status = res.data;
        if (!status) {
          this.phoneMatched = true;
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
        // console.log(this.sendVerificationCode);

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
      // console.log(this.formData.value.otpCode);

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

  ngOnDestroy() {
    if (this.timeInstance !== null && this.timeInstance !== undefined) {
      clearInterval(this.timeInstance);
    }

    this.otpMatched = false;
  }

  /**
   * DISABLE SUBMIT
   */

  get disableSubmit() {
    if (this.formData.valid && this.formData.value.agree) {
      if (this.isPhoneReg && this.formData.value.phoneNo) {
        if (this.otpMatched) {
          return false;
        } else {
          return true;
        }
      } else if (this.isEmailReg && this.formData.value.email) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }


  /**
   * Form Validations
   */
  get phoneNo() {
    return this.formData.get('phoneNo');
  }

  get email() {
    return this.formData.get('email');
  }

  get fullName() {
    return this.formData.get('fullName');
  }

  get password() {
    return this.formData.get('password');
  }

  get confirmPassword() {
    return this.formData.get('confirmPassword');
  }

  get gender() {
    return this.formData.get('gender');
  }

  get agree() {
    return this.formData.get('agree');
  }

  get birthDate() {
    return this.formData.get('birthDate');
  }

  get birthYear() {
    return this.formData.get('birthYear');
  }

  get birthMonth() {
    return this.formData.get('birthMonth');
  }

  get otpCode() {
    return this.formData.get('otpCode');
  }


}
