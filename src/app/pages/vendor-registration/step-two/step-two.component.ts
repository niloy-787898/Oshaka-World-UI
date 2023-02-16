import { Component, OnInit } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {NgxSpinnerService} from 'ngx-spinner';

import {AngularFireAuth} from '@angular/fire/auth';

import {Router} from '@angular/router';
import firebase from 'firebase';
import {UtilsService} from "../../../services/core/utils.service";
import {WindowService} from "../../../services/common/window.service";
import {UiService} from "../../../services/core/ui.service";
import {VendorService} from "../../../services/common/vendor.service";
import {Select} from "../../../interfaces/core/select";
import {Vendor} from "../../../interfaces/common/vendor";


@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss']
})
export class StepTwoComponent implements OnInit {

  // Step One Data
  stepOneData: any;

  // Loading
  isLoading = false;

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

  areas: Select[] = [
    {value: 'Dhaka', viewValue: 'Dhaka'},
    {value: 'Rajshahi', viewValue: 'Rajshahi'},
  ];

  zones: Select[] = [
    {value: 'Mirpur', viewValue: 'Mirpur'},
    {value: 'Durgapur', viewValue: 'Durgapur'},
  ];

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
      vendorType: [null, Validators.required],
      shopName: [null, Validators.required],
      shopArea: [null, Validators.required],
      shopZone: [null, Validators.required],
      address: [null, Validators.required],
      agree: [true, Validators.required],
      paymentReceiveType: [true, Validators.required],
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
      shopSlug: this.utilsService.convertStringToSlug(this.formData.value.shopName),
      hasVendorAccess: true,
      approved: false,
      vendorPriority: 0,
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

  get otpCode() {
    return this.formData.get('otpCode');
  }

}
