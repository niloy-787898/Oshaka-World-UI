import { Component, Input, OnInit } from '@angular/core';
import {Order} from "../../../../../interfaces/common/order.interface";
import {ShopService} from "../../../../../services/common/shop.service";
import {ShopInformation} from "../../../../../interfaces/common/shop-information.interface";


@Component({
  selector: 'app-print-invoice',
  templateUrl: './print-invoice.component.html',
  styleUrls: ['./print-invoice.component.scss']
})
export class PrintInvoiceComponent implements OnInit {

  @Input() order: Order = null;
  contactInfoData: ShopInformation;

  constructor(
    private shopService: ShopService
  ) { }

  ngOnInit(): void {
    this.getContactInfo();
  }

  private getContactInfo() {
    this.shopService.getShopInfo()
      .subscribe(res => {
        this.contactInfoData = res.data;
      }, error => {
        console.log(error);
      });
  }

}
