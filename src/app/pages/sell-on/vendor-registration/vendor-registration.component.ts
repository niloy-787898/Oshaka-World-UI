import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase/app';
import 'firebase/auth';
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {MatSelectChange} from '@angular/material/select';
import {Select} from "../../../interfaces/core/select";
import {VendorService} from "../../../services/common/vendor.service";
import {UiService} from "../../../services/core/ui.service";
import {WindowService} from "../../../services/common/window.service";
import {UtilsService} from "../../../services/core/utils.service";
import {Vendor} from "../../../interfaces/common/vendor";
import {Area, LocationData} from "../../../interfaces/common/locations";

// import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
@Component({
  selector: 'app-vendor-registration',
  templateUrl: './vendor-registration.component.html',
  styleUrls: ['./vendor-registration.component.scss']
})
export class VendorRegistrationComponent implements OnInit {


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
  // public sendVerificationCode = false;
  // public showVerificationCodeField = false;
  phoneMatched = false;
  storedPhoneNo: string = null;
  // otpMatched: boolean = null;

  // Base Data
  vendorTypes: Select[] = [
    {value: 1, viewValue: 'Online'},
    {value: 2, viewValue: 'Offline'},
  ];

  paymentReceiveTypes: Select[] = [
    {value: 1, viewValue: 'Mobile Banking'},
    {value: 2, viewValue: 'Banking'},
    {value: 3, viewValue: 'Cash'},
  ];

  locations: LocationData[] = [];

  public cityTemp = null;
  public areaTemp:Area[]= null;
  public selectArea = null;
  public zoneTemp = null;

  areas: Select[] = [
    {value: 'Dhaka', viewValue: 'Dhaka'},
    {value: 'Rajshahi', viewValue: 'Rajshahi'},
  ];

  zones: Select[] = [
    {value: 'Mirpur', viewValue: 'Mirpur'},
    {value: 'Durgapur', viewValue: 'Durgapur'},
  ];

  // Show Preview Logic
  selectedStep = 0;



  constructor(
    private vendorService: VendorService,
    private uiService: UiService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    public utilsService: UtilsService,
    private afAuth: AngularFireAuth,
    private win: WindowService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.locations = this.utilsService.locationData;


    this.windowRef = this.win.windowRef;

    this.formData = this.fb.group({
      email: [null, Validators.required],
      phoneNo: [null, Validators.required],
      // otpCode: [null],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required],
      vendorType: [null, Validators.required],
      shopName: [null, Validators.required],
      vendorName: [null, Validators.required],
      shopArea: [null, Validators.required],
      shopZone: [null, Validators.required],
      address: [null, Validators.required],
      agree: [true, Validators.required],
      paymentServiceName: [null],
      paymentServiceNo: [null],
      paymentReceiveType: [true, Validators.required]
    });
    // if (this.data) {
    //   this.setFormData();
    // }
  }


  onClickCity() {
    this.formData.patchValue({shopZone: this.areaTemp});
  }

  onSelectCity(event: MatSelectChange) {
    this.cityTemp = event.value.city;
    this.areaTemp = event.value.area;
    this.zoneTemp = null;
    // this.filterDataFields = this.categories.find(x => x._id === event.value._id).filters;
  }

  onSelectArea(event: MatSelectChange) {
    this.zoneTemp = event.value.name;
    // this.filterDataFields = this.categories.find(x => x._id === event.value._id).filters;
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
  // onSentOtp() {
  //   if (!this.formData.value.phoneNo) {
  //     this.phoneNo.markAsTouched({onlySelf: true});
  //     this.uiService.warn('No phone number provided');
  //     return;
  //   }
  //
  //   this.checkAndGetUserByPhone();
  // }

  onSubmitForm() {

    if (this.formData.invalid) {
      return  this.uiService.warn('Something Wrong Fill All Required Filled');
    }

    if (this.formData.value.password !== this.formData.value.confirmPassword) {
      console.log('onsubmit')
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
      shopSlug: this.utilsService.convertStringToSlug(this.formData.value.shopName),
      vendorName: this.formData.value.phoneNo,
      hasVendorAccess: true,
      approved: false,
      vendorPriority: 0,
      shopArea:this.cityTemp,
      shopZone:this.zoneTemp,
      isPhoneVerified:  false,
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
    this.vendorService.checkAndGetVendorByPhone(this.storedPhoneNo)
      .subscribe(res => {
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
        // this.showVerificationCodeField = true;
        // this.sendVerificationCode = true;
        // console.log(this.sendVerificationCode.valueOf);

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
  // verifyOtpCode() {
  //   this.windowRef.confirmationResult
  //     .confirm(this.formData.value.otpCode)
  //
  //
  //
  //     .then(() => {
  //       // console.log(this.otpCode.value);
  //       // this.otpMatched = true;
  //       // Reset Value..
  //       // this.showVerificationCodeField = false;
  //       // this.sendVerificationCode = false;
  //       this.windowRef.confirmationResult = null;
  //       this.uiService.success('Phone verification success');
  //       clearInterval(this.timeInstance);
  //     })
  //     .catch(error => this.uiService.wrong('ERROR Code! Incorrect code entered?'));
  // }

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

    // this.otpMatched = false;
  }

  /**
   * DISABLE SUBMIT
   */

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

  get vendorType() {
    return this.formData.get('vendorType');
  }

  get shopName() {
    return this.formData.get('shopName');
  }

  get shopArea() {
    return this.formData.get('shopArea');
  }

  get shopZone() {
    return this.formData.get('shopZone');
  }

  get address() {
    return this.formData.get('address');
  }

  get password() {
    return this.formData.get('password');
  }

  get confirmPassword() {
    return this.formData.get('confirmPassword');
  }

  get agree() {
    return this.formData.get('agree');
  }

  // get otpCode() {
  //   return this.formData.get('otpCode');
  //   // console.log(this.otpCode);
  //
  // }

  public checkNextClick() {
    if (this.isPhoneReg) {
      if (this.formData.get('phoneNo').valid &&
        this.formData.get('email').valid &&
        this.formData.get('password') &&
        this.formData.get('confirmPassword') &&
        this.formData.get('vendorName')
      ) {
        if (this.formData.get('password').value === this.formData.get('confirmPassword').value) {
          this.selectedStep = 1;
        } else {
          this.uiService.warn('Password and confirm password not matched');
        }
      } else {
        this.formData.get('email').markAsTouched();
        this.formData.get('password').markAsTouched();
        this.formData.get('confirmPassword').markAsTouched();
        this.formData.get('vendorName').markAsTouched();
      }

    } else {
      this.formData.get('phoneNo').markAsTouched();
      this.uiService.warn('Please verify your phone number first.');
    }

  }

}
