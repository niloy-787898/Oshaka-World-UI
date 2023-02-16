import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ShopInformation} from '../../interfaces/common/shop-information.interface';

const API_SHOP_INFO = environment.apiBaseLink + '/api/shop-information/';


@Injectable({
  providedIn: 'root'
})
export class ShopInformationService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * getShopInformation
   */

  getShopInformation(select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: ShopInformation, message: string, success: boolean }>(API_SHOP_INFO + 'get', {params});
  }

}
