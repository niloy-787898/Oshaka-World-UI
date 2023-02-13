import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {Coupon} from '../../../interfaces/common/coupon.interface';
import {ActivatedRoute} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {CouponService} from '../../../services/common/coupon.service';
import {Clipboard} from '@angular/cdk/clipboard';

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.scss']
})
export class OfferDetailsComponent implements OnInit {

  // Store Data
  id?: string;
  coupon?: Coupon;
  selectedCoupon: string = null;

  // Subscriptions
  private subDataOne: Subscription;
  private subRouteOne: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private couponService: CouponService,
    private spinnerService: NgxSpinnerService,
    private clipboard: Clipboard,
  ) { }

  ngOnInit(): void {
    // GET ID FORM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getCouponById();
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   * getCouponById()
   */

  private getCouponById() {
    this.spinnerService.show();
    this.subDataOne = this.couponService.getCouponById(this.id)
      .subscribe(res => {
        this.spinnerService.hide();
        if (res.success) {
          this.coupon = res.data;
        }
      }, error => {
        this.spinnerService.hide();
        console.log(error);
      });
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
