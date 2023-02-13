import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Coupon} from '../../interfaces/common/coupon.interface';
import {FilterData} from '../../interfaces/core/filter-data';

const API_TAG = environment.apiBaseLink + '/api/coupon/';


@Injectable({
  providedIn: 'root'
})
export class CouponService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * checkCouponAvailability
   * getAllCoupons
   * getCouponById
   */

  checkCouponAvailability(data: {couponCode: string, subTotal: number}) {
    return this.httpClient.post<ResponsePayload>
    (API_TAG + 'check-coupon-availability', data);
  }

  getAllCoupons(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Coupon[], count: number, success: boolean }>(API_TAG + 'get-all', filterData, {params});
  }

  getCouponById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Coupon, message: string, success: boolean }>(API_TAG + id, {params});
  }


}
