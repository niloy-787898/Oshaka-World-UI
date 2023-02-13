import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {Order} from '../../../../interfaces/common/order.interface';
import {OrderService} from '../../../../services/common/order.service';
import {NgClassService} from '../../../../services/core/ng-class.service';
import {Pagination} from '../../../../interfaces/core/pagination';
import {FilterData} from '../../../../interfaces/core/filter-data';
import {OrderStatus} from '../../../../enum/order.enum';


@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit, OnDestroy {
  private subAcRoute: Subscription;

  // Store Data
  orders: Order[] = [];

  // Pagination
  currentPage = 1;
  totalOrders = 0;
  ordersPerPage = 10;
  totalOrdersStore = 0;

  // Subscriptions
  private subDataOne: Subscription;
  private subRouteOne: Subscription;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public ngClassService: NgClassService,
  ) {
  }

  ngOnInit(): void {
    // GET PAGE FROM QUERY PARAM
    this.subRouteOne = this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam['page']) {
        this.currentPage = qParam['page'];
      } else {
        this.currentPage = 1;
      }
      this.getOrdersByUser();
    });
  }

  /**
   * HTTP REQ HANDLE
   * getAllOrders()
   */

  private getOrdersByUser() {
    this.spinner.show();
    const pagination: Pagination = {
      pageSize: Number(this.ordersPerPage),
      currentPage: Number(this.currentPage) - 1
    };

    // FilterData
    // const mQuery = this.filter.length > 0 ? {$and: this.filter} : null;

    // Select
    const mSelect = {
      orderId: 1,
      phoneNo: 1,
      city: 1,
      paymentType: 1,
      grandTotal: 1,
      checkoutDate: 1,
      orderStatus: 1,
      paymentStatus: 1,
      createdAt: 1,
    }

    const filterData: FilterData = {
      pagination: pagination,
      filter: {orderStatus: OrderStatus.DELIVERED},
      select: mSelect,
      sort: {createdAt: -1}
    }


    this.subDataOne = this.orderService.getOrdersByUser(filterData, null)
      .subscribe(res => {
        console.log('res', res.data)
        this.spinner.hide();
        this.orders = res.data;
        this.totalOrders = res.count;
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
   * ON DESTROY
   */
  ngOnDestroy() {

    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }

    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }
  }


}
