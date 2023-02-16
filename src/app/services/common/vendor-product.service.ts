import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from "../../../environments/environment";


const API_VENDOR_PRODUCT = environment.apiBaseLink + '/api/vendor-product/';


@Injectable({
  providedIn: 'root'
})
export class VendorProductService {

  constructor(
    private http: HttpClient
  ) {
  }

  /**
   * VENDOR_PRODUCT
   */

  editProductById(data: any) {
    return this.http.put<{ message: string }>(API_VENDOR_PRODUCT + 'edit-product-by-id', data);
  }





}
