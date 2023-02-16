import { Component, OnInit } from '@angular/core';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {Order, OrderedItem} from "../../../interfaces/common/order.interface";
import {OrderService} from "../../../services/common/order.service";


@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  // orders: any[] = [
  //   {
  //     _id: '1',
  //     checkoutDate: 'May 4, 2021',
  //     deliveryStatus: 'delivered',
  //     paymentMethod: 'Cash on Delivery',
  //     orderStatus: 'cancel',
  //     totalAmount: '170',
  //     city: 'Dhaka',
  //     area: 'Mirpur-10'
  //   }
  // ];

  orders: Order[] = null;

  constructor(
    private dialog: MatDialog,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.getOrders()
  }

  getOrders() {
    this.orderService.getAllTransactionByVendor()
    .subscribe( res => {
      this.orders = res.data;
      console.log(this.orders);
    }, err => {
      console.log(err);
    });
  }

  vendorAmount(items: OrderedItem[]): number {
    let amount = 0;
    items.map( item => {
      if (item.commission) {
        amount = amount + (item.price * ((100 - item.commission) / 100) );
      }
    });
    return amount;
  }

  onPageChanged($event: number) {

  }

  openUpdateOrderDialog(_id: any, deliveryStatus: any) {

  }

  public openConfirmDialog(data?: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this category?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        console.log('Data should be deleted');
        // TODO DELETE PROCESS HANDLE HERE
      }
    });
  }
}
