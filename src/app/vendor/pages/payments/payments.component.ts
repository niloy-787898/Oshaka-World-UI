import {Component, OnInit} from '@angular/core';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {UiService} from "../../../services/core/ui.service";
import {VendorService} from "../../../services/common/vendor.service";
import {VendorPaymentService} from "../../../services/common/vendor-payment.service";
import {VendorPayment} from "../../../interfaces/common/vendor-payment";
import {Vendor} from "../../../interfaces/common/vendor";

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {

  vendor: Vendor = null;
  payments: VendorPayment[] = [];
  receivedPayment: number;

  constructor(
    private dialog: MatDialog,
    private uiService: UiService,
    private vendorService: VendorService,
    private vendorPaymentService: VendorPaymentService
  ) { }

  ngOnInit(): void {
    this.getLoggedInVendorInfo()
  }

  getLoggedInVendorInfo() {
    console.log('here');
    this.vendorService.getLoggedInVendor()
    .subscribe( res => {
      this.vendor = res.data;
      console.log('this is vendor');
      console.log(this.vendor);
      this.getVendorPayments();
      console.log(this.payments);
    }, err => {
      console.log(err);
    });
  }

  getVendorPayments() {
    this.vendorPaymentService.getVendorPayments(this.vendor._id)
    .subscribe( res => {
      this.payments = res.data;
      // console.log('this is payments');
      // console.log(this.payments);
      // if (this.payments){
      //   for ( let data of this.payments) {
      //     this.receivedPayment = this.receivedPayment + data.amount;
      //     console.log('this is receivedPayment', this.receivedPayment);
      //   }
      // }
      console.log(this.payments);
    }, err => {
      console.log(err);
    });
  }

  public openConfirmDialog(data?: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Payment',
        message: 'Are you sure you want to confirm this payment?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        console.log('Payment Should Be Confirmed');
        // TODO DELETE PROCESS HANDLE HERE
        this.vendorPaymentService.changePaymentStatusById({id: data._id, status: 'accepted'})
        .subscribe( res => {
          this.uiService.success(res.message);
        }, err => {
          console.log(err);
        });
      }
    });
  }

}
