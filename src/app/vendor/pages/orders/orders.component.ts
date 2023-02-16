import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSelect, MatSelectChange} from '@angular/material/select';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {FormControl, FormGroup} from '@angular/forms';
import {UpdateOrderStatusComponent} from './update-order-status/update-order-status.component';
import {OrderStatus} from "../../../enum/order.enum";
import {UiService} from "../../../services/core/ui.service";
import {Pagination} from "../../../interfaces/core/pagination";
import {UtilsService} from "../../../services/core/utils.service";
import {OrderService} from "../../../services/common/order.service";
import {Order} from "../../../interfaces/common/order.interface";


export interface OrderFilter {
  deliveryStatus?: number;
  checkoutDate?: any;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {


  private subAcRoute: Subscription;

  public orderEnum = OrderStatus;

  orders: Order[] = [];

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 5;
  totalProductsStore = 0;

  orderStatus: any[] = [
    {value: null, viewValue: 'None'},
    {value: OrderStatus.PENDING, viewValue: 'Pending'},
    {value: OrderStatus.CONFIRM, viewValue: 'Confirm'},
    {value: OrderStatus.PROCESSING, viewValue: 'Processing'},
    {value: OrderStatus.SHIPPING, viewValue: 'Shipping'},
    {value: OrderStatus.DELIVERED, viewValue: 'Delivered'},
    {value: OrderStatus.CANCEL, viewValue: 'Cancel'},
    {value: OrderStatus.REFUND, viewValue: 'Refund'},
  ];



  // Filter Date Range
  startDate?: string;
  endDate?: string;

  // Form Group
  dataFormRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  // Data Filtering
  isFiltering = false;

  // Max & Min Data
  today = new Date();
  // QUERY
  filterQuery: OrderFilter = null;

  @ViewChild('matSelectFilter') matSelectFilter: MatSelect;


  constructor(
    private dialog: MatDialog,
    private orderService: OrderService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private uiService: UiService,
    private utilsService: UtilsService,
  ) {
  }

  ngOnInit(): void {
    this.subAcRoute = this.activatedRoute.queryParams.subscribe((qParam: any) => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      this.getAllOrdersByVendor();
    });
  }

  updatedAmount() {
    this.orders.map( order => {
      let refundAmount = 0;
      order.orderedItems.map( item => {
        if (!item.product && item.deleteDeliveryStatus === "not-shipped-or-delivered") {
          refundAmount += item.price * item.quantity;
        }
      });
      order.refundAmount = refundAmount;
    });
  }

  private getAllOrdersByVendor() {
    this.spinner.show();

    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };

    this.orderService.getAllOrdersByVendor(pagination, null, this.filterQuery)
      .subscribe(res => {
        console.log('here', res.data);
        this.orders = res.data;
        if (this.orders) {
          this.updatedAmount();
        }
        this.totalProducts = res.count;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }


  /**
   * PAGINATION CHANGE
   */
  public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}});
  }

  /**
   * NG CLASS
   */
  getDeliveryStatusColor(order: Order) {
    switch (order.deliveryStatus) {

      case this.orderEnum.CANCEL: {
        return 'cancel';
      }
      case this.orderEnum.PROCESSING: {
        return 'processing';
      }
      case this.orderEnum.CONFIRM: {
        return 'confirm';
      }
      case this.orderEnum.DELIVERED: {
        return 'delivered';
      }
      case this.orderEnum.REFUND: {
        return 'refund';
      }
      case this.orderEnum.SHIPPING: {
        return 'shipping';
      }
      default: {
        return 'none';
      }
    }
  }

  /**
   * OPEN COMPONENT DIALOG
   */

  public openUpdateOrderDialog(order?: Order) {
    const dialogRef = this.dialog.open(UpdateOrderStatusComponent, {
      data: order,
      panelClass: ['theme-dialog'],
      // width: '100%',
      // minHeight: '60%',
      autoFocus: false,
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        // if (dialogResult.selectedIds) {
        //   this.selectedProductIds = dialogResult.selectedIds;
        //   this.dataForm.patchValue({products: dialogResult.selectedIds});
        //   this.getSpecificProductsById(this.selectedProductIds);
        // }
      }
    });
  }

  /**
   * ON FILTER CHANGE
   */
  onFilterSelectChange(event: MatSelectChange) {
    if (event.value) {
      if (this.filterQuery && this.filterQuery.deliveryStatus) {
        this.filterQuery.deliveryStatus = event.value;
      } else if (this.filterQuery) {
        this.filterQuery = {...this.filterQuery, ...{deliveryStatus: event.value}};
      } else {
        this.filterQuery = {deliveryStatus: event.value};
      }
      console.log('On Type Filter');
      console.log(this.filterQuery);
      this.getAllOrdersByVendor();
    } else {
      delete this.filterQuery.deliveryStatus;
      this.getAllOrdersByVendor();

    }
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


  /**
   * FILTER DATA
   */

  onFilterData() {
    // if (
    //   this.dataFormRange.controls.start.hasError('matStartDateInvalid') ||
    //   !this.dataFormRange.value.start
    // ) {
    //   this.uiService.warn('Invalid start date');
    //   return;
    // }
    //
    // if (
    //   this.dataFormRange.controls.end.hasError('matEndDateInvalid') ||
    //   !this.dataFormRange.value.end
    // ) {
    //   this.uiService.warn('Invalid end date');
    //   return;
    // }
    this.isFiltering = true;
    this.startDate = this.utilsService.getDateString(this.dataFormRange.value.start);
    this.endDate = this.utilsService.getDateString(this.dataFormRange.value.end);


    // this.getAllReports();

    if (this.isFiltering) {

      if (this.filterQuery && this.filterQuery.checkoutDate) {
        this.filterQuery.checkoutDate = { $gte: this.startDate, $lte: this.endDate };
      } else if (this.filterQuery) {
        this.filterQuery = {...this.filterQuery, ...{checkoutDate: { $gte: this.startDate, $lte: this.endDate }}};
      } else {
        this.filterQuery = {checkoutDate: { $gte: this.startDate, $lte: this.endDate }};
      }

      this.getAllOrdersByVendor();

      console.log('On date Filter');
      console.log(this.filterQuery);

      // this.filterQuery = {checkoutDate: { $gte: this.startDate, $lte: this.endDate }}

      // const date = this.utilsService.getStartEndDate(new Date(), true);
      // this.startDate = date.firstDay as string;
      // this.endDate = this.utilsService.getDateString(new Date());
    }

  }

  /**
   * CLEAR FILTERING
   */
  clearFiltering() {
    this.isFiltering = false;
    this.dataFormRange.reset();
    this.filterQuery = null;
    this.matSelectFilter.value = null;
    this.getAllOrdersByVendor();
  }



  /**
   * ON DESTROY
   */
  ngOnDestroy() {

    if (this.subAcRoute) {
      this.subAcRoute.unsubscribe();
    }
  }


}
