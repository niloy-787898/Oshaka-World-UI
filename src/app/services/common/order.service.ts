import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Order} from '../../interfaces/common/order.interface';
import {FilterData} from '../../interfaces/core/filter-data';

const API_ORDER = environment.apiBaseLink + '/api/order/';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addOrder
   * getOrdersByUser
   * getOrderById
   * updateOrderById
   */

  addOrder(data: Order) {
    return this.httpClient.post<ResponsePayload>
    (API_ORDER + 'add', data);
  }

  getOrdersByUser(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Order[], count: number, success: boolean }>(API_ORDER + 'get-orders-by-user', filterData, {params});
  }


  getOrderById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Order, message: string, success: boolean }>(API_ORDER + id, {params});
  }

  updateOrderById(id: string, data: Order) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_ORDER + 'update/' + id, data);
  }

}
