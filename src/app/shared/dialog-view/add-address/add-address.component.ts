import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {UiService} from '../../../services/core/ui.service';
import {UserDataService} from '../../../services/common/user-data.service';
import {ReloadService} from '../../../services/core/reload.service';
import {Address} from '../../../interfaces/common/address.interface';
import {ADDRESS_TYPES, CITIES} from '../../../core/utils/app-data';


@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss']
})
export class AddAddressComponent implements OnInit {
  @ViewChild('formElement') formElement: NgForm;
  //Store data
  address: Address[];

  //Static Data
  cities: string[] = CITIES;
  addressTypes: string[] = ADDRESS_TYPES;

  //Form group
  dataForm?: FormGroup;


  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;


  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private userDataService: UserDataService,
    private reloadService: ReloadService,
    public dialogRef: MatDialogRef<AddAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Address,
  ) {
  }

  ngOnInit(): void {
    //Init Form
    this.initFormGroup();

    //Patch Value
    if (this.data) {
      this.dataForm.patchValue(this.data);
    }

  }


  /**
   * INIT FORM & CONTROL
   * initFormGroup()
   * onSubmit()
   */

  private initFormGroup() {
    this.dataForm = this.fb.group({
      addressType: [this.addressTypes[0], Validators.required],
      phone: new FormControl(
        {value: null, disabled: false},
        [
          Validators.minLength(11)
        ]
      ),
      city: [null, Validators.required],
      address: [null, Validators.required],
    });

  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required field');
      return;
    }

    const finalData = {...this.dataForm.value};

    if (this.data) {
      this.editAddress();
    } else {
      this.addAddress(finalData);
    }
  }


  /**
   * Http req Handle
   * addAddress()
   * editAddress()
   */

  addAddress(data: Address) {
    this.subDataOne = this.userDataService.addAddress(data)
      .subscribe((res) => {
        this.uiService.success(res.message);
        this.formElement.resetForm();
        this.reloadService.needRefreshData$();
        this.dialogRef.close()
      }, error => {
        console.log(error);
      });
  }

  editAddress() {
    const finalData = {...this.dataForm.value, ...{_id: this.data._id}};
    this.subDataTwo = this.userDataService.editAddress(this.data._id, finalData)
      .subscribe((res) => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshData$();
        this.dialogRef.close()
      }, error => {
        console.log(error);
      });
  }

  /**
   * NG ON DESTROY
   */
  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }
  }


}
