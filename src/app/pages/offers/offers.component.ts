import {Component, OnDestroy, OnInit} from '@angular/core';
import {Clipboard} from '@angular/cdk/clipboard';
import {Coupon} from '../../interfaces/common/coupon.interface';
import {Pagination} from '../../interfaces/core/pagination';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {FilterData} from '../../interfaces/core/filter-data';
import {Subscription} from 'rxjs';
import {CouponService} from '../../services/common/coupon.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit, OnDestroy {

  // Store Data
  coupons: Coupon[] = [];
  selectedCoupon: string = null;

  // Pagination
  currentPage = 1;
  totalSubCategories = 0;
  couponsPerPage = 10;

  // Subscriptions
  private subDataOne: Subscription;
  private subRouteOne: Subscription;

  constructor(
    private clipboard: Clipboard,
    private couponService: CouponService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
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
      this.getAllCoupons();
    });

  }

  /**
   * HTTP REQ HANDLE
   *getAllCategories()
   * getAllSubCategorie()
   * deleteCouponById()
   * updateMultipleCouponById()
   */

  private getAllCoupons() {
    this.spinner.show();
    const pagination: Pagination = {
      pageSize: Number(this.couponsPerPage),
      currentPage: Number(this.currentPage) - 1
    };


    // Select
    const mSelect = {
      name: 1,
      bannerImage: 1,
      couponCode: 1,
      startDateTime: 1,
      endDateTime: 1,
      createdAt: 1,
    }

    const filterData: FilterData = {
      pagination: pagination,
      filter: null,
      select: mSelect,
      sort: {createdAt: -1}
    }


    this.subDataOne = this.couponService.getAllCoupons(filterData, null)
      .subscribe(res => {
        console.log('res.data', res)
        this.spinner.hide();
        this.coupons = res.data;
        this.totalSubCategories = res.count;
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
   * COPY TO CLIPBOARD
   * copyCouponCode()
   */
  copyCouponCode(event: MouseEvent, data: Coupon) {
    event.stopPropagation();
    this.selectedCoupon = data._id
    this.clipboard.copy(data.couponCode);
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
