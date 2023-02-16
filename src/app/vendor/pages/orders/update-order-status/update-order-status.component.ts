import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {NgxSpinnerService} from 'ngx-spinner';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {OrderStatus} from "../../../../enum/order.enum";
import {UiService} from "../../../../services/core/ui.service";
import {Select} from "../../../../interfaces/core/select";
import {UtilsService} from "../../../../services/core/utils.service";
import {OrderService} from "../../../../services/common/order.service";
import {Order} from "../../../../interfaces/common/order.interface";


@Component({
  selector: 'app-update-order-status',
  templateUrl: './update-order-status.component.html',
  styleUrls: ['./update-order-status.component.scss']
})
export class UpdateOrderStatusComponent implements OnInit {

  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  dataForm?: FormGroup;
  private sub: Subscription;

  public orderEnum = OrderStatus;

  autoSlug = true;
  isLoading = false;

  // Store Data from param
  order: Order = null;

  today = new Date();

  orderStatus: Select[] = [
    {value: OrderStatus.PENDING, viewValue: 'Pending'},
    {value: OrderStatus.CONFIRM, viewValue: 'Confirm'},
    {value: OrderStatus.PROCESSING, viewValue: 'Processing'},
    {value: OrderStatus.SHIPPING, viewValue: 'Shipping'},
    {value: OrderStatus.DELIVERED, viewValue: 'Delivered'},
    {value: OrderStatus.CANCEL, viewValue: 'Cancel'},
    {value: OrderStatus.REFUND, viewValue: 'Refund'},
  ];

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private orderService: OrderService,
    private utilsService: UtilsService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<UpdateOrderStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      deliveryStatus: [null, Validators.required],
      nextPhaseDate: [null],
    });

    if (this.data) {
      this.order = this.data;
      const defaultData = {
        deliveryStatus: this.order.deliveryStatus
      };
      this.dataForm.patchValue(defaultData);
    }
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }

    if (this.order) {
      const mData = {
        updateDate: this.utilsService.getDateString(new Date()),
        nextPhaseDate: this.dataForm.value.nextPhaseDate ?
          this.utilsService.getDateString(new Date(this.dataForm.value.nextPhaseDate)) : null
      };
      const finalData = {...this.dataForm.value, ...{_id: this.order._id}, ...mData};
      console.log(finalData);
      this.changeOrderStatus(finalData);
    }

  }


  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  private changeOrderStatus(data: any) {
    this.spinner.show();
    this.orderService.changeOrderStatus(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.dialogRef.close();
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  get showDateField(): any {
    if (this.dataForm.value) {
      switch (this.dataForm.value.deliveryStatus) {

        case this.orderEnum.CANCEL: {
          this.dataForm.get('nextPhaseDate').clearValidators();
          this.dataForm.get('nextPhaseDate').updateValueAndValidity();
          this.dataForm.value.nextPhaseDate = null;
          return false;
        }
        case this.orderEnum.PROCESSING: {
          this.dataForm.get('nextPhaseDate').setValidators([Validators.required]);
          return true;
        }
        case this.orderEnum.CONFIRM: {
          this.dataForm.get('nextPhaseDate').setValidators([Validators.required]);
          return true;
        }
        case this.orderEnum.DELIVERED: {
          this.dataForm.get('nextPhaseDate').clearValidators();
          this.dataForm.get('nextPhaseDate').updateValueAndValidity();
          this.dataForm.value.nextPhaseDate = null;
          return false;
        }
        case this.orderEnum.REFUND: {
          this.dataForm.get('nextPhaseDate').clearValidators();
          this.dataForm.get('nextPhaseDate').updateValueAndValidity();
          this.dataForm.value.nextPhaseDate = null;
          return false;
        }
        case this.orderEnum.SHIPPING: {
          this.dataForm.get('nextPhaseDate').setValidators([Validators.required]);
          return true;
        }
        default: {
          this.dataForm.get('nextPhaseDate').clearValidators();
          this.dataForm.get('nextPhaseDate').updateValueAndValidity();
          this.dataForm.value.nextPhaseDate = null;
          return false;
        }
      }
    }
  }


  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
