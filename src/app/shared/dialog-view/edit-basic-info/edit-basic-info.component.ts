import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {NgxSpinnerService} from 'ngx-spinner';
import {DATABASE_KEY} from '../../../core/utils/global-variable';
import {UiService} from '../../../services/core/ui.service';
import {User} from '../../../interfaces/common/user.interface';
import {Select} from '../../../interfaces/core/select';
import {UtilsService} from '../../../services/core/utils.service';
import {UserDataService} from '../../../services/common/user-data.service';
import {ReloadService} from '../../../services/core/reload.service';
import {StorageService} from '../../../services/core/storage.service';

@Component({
  selector: 'app-edit-basic-info',
  templateUrl: './edit-basic-info.component.html',
  styleUrls: ['./edit-basic-info.component.scss']
})
export class EditBasicInfoComponent implements OnInit {


  // OTP
  generatedOtpCode: string;
  // Registration User Data
  registrationData: User;

  public formData: FormGroup;

  genders: Select[] = [
    {value: 'male', viewValue: 'Male'},
    {value: 'female', viewValue: 'Female'},
    {value: 'other', viewValue: 'Other'},
  ];
  private message: string;

  constructor(
    private fb: FormBuilder,
    private userDataService: UserDataService,
    private uiService: UiService,
    private reloadService: ReloadService,
    public dialogRef: MatDialogRef<EditBasicInfoComponent>,
    public utilsService: UtilsService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private storageService: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit(): void {

    this.formData = this.fb.group({
      name: [null, Validators.required],
      // username: [null, Validators.required],
      email: null,
      gender: null,
    });

    this.setFormData();

  }

  private setFormData() {
    console.log(this.data)
    this.formData.patchValue(this.data);
  }

  /**
   * ON SUBMIT FORM
   */

  onSubmit() {
    if (this.formData.invalid) {
      this.uiService.warn('Please complete all the required field');
      return;
    }
    const mData = {
      birthdate: this.utilsService.getDateWithCurrentTime(this.formData.value.birthdate),
    };

    const finalData = {...this.formData.value, ...mData};
    this.editLoggedInUserData(finalData);
    // if (this.formData.value.phoneNo !== this.data.phoneNo){
      // const finalPhoneNo = '88' + this.formData.value.phoneNo;
      // this.generatedOtpCode = this.utilsService.getRandomOtpCode6();
      // console.log('OTP COde', this.generatedOtpCode);
      // const message = this.generatedOtpCode + ' is your OTP (One-Time Password) for Esquire Electronics. OTP will expire in 5 minutes.';
      // this.sendSmsBySslAPi(finalPhoneNo, message, finalPhoneNo);
      // this.message = this.storageService.getDataFromSessionStorage(DATABASE_KEY.otpCheck);
    //   if (this.message){
    //     this.editLoggedInUserData(finalData);
    //   }
    // }else{
    //   this.editLoggedInUserData(finalData);
    // }

  }

  editLoggedInUserData(data: User) {
    this.userDataService.updateLoggedInUserInfo(data)
      .subscribe((res) => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshData$();
        this.dialogRef.close();
        // this.matDialog.closeAll();
      }, error => {
        console.log(error);
      });
  }

  /**
   * BULK SMS
   */
  // private sendSmsBySslAPi(phoneNo: string, message: string, uid: string) {
  //   const messageBody: BulkSms = {
  //     sms: message,
  //     csmsid: uid,
  //     msisdn: phoneNo
  //   };
  //   this.bulkSmsService.sendSmsBySslAPi(messageBody)
  //     .subscribe(res => {
  //       this.spinner.hide();
  //       if (res.success) {
  //         this.openComponentDialog();
  //       } else {
  //         this.spinner.hide();
  //         this.uiService.wrong('Something went wrong! Please try again.');
  //       }
  //     }, error => {
  //       this.uiService.wrong('Something went wrong! Please try again.');
  //       console.log(error);
  //       this.spinner.hide();
  //     });
  // }

  /**
   *  COMPONENT DIALOG
   */
  // public openComponentDialog() {
  //   const mData = {
  //     otpCode: this.generatedOtpCode,
  //     phoneNo: this.formData.value.phoneNo,
  //     registrationData: this.registrationData
  //   };
  //   const dialogRef = this.dialog.open(PhoneVerificationDialogComponent, {
  //     data: mData,
  //     panelClass: ['theme-dialog', 'dialog-no-radius', 'small-padding-sm'],
  //     width: '95%',
  //     maxWidth: '400px',
  //     autoFocus: false,
  //     disableClose: true,
  //   });
  //
  //   dialogRef.afterClosed().subscribe(dialogResult => {
  //     if (dialogResult.regProgress) {
  //       this.spinner.show();
  //     }
  //   });
  // }


}
