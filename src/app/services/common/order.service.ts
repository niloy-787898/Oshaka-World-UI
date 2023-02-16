import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Order} from '../../interfaces/common/order.interface';
import {FilterData} from '../../interfaces/core/filter-data';
import {Pagination} from "../../interfaces/core/pagination";

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
   * getAllOrdersByVendor
   * changeOrderStatus
   * getOrderDetails
   * addOrder
   * getOrdersByUser
   * getOrderById
   * updateOrderById
   */
  getAllOrdersByVendor(pagination ?: Pagination, select ?: string, query ?: any) {
    let params = new HttpParams();

    if (pagination) {
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
      if (select) {
        params = params.append('select', select);
      }
      return this.httpClient.post < {
        data: Order[],
        count: number,
        message ?: string
      } >
      (API_ORDER + 'get-all-orders-by-vendor', {
        query
      }, {
        params
      });
    } else {
      if (select) {
        params = params.append('select', select);
      }
      return this.httpClient.post < {
        data: Order[],
        count: number,
        message ?: string
      } >
      (API_ORDER + 'get-all-orders-by-vendor', {
        query
      }, {
        params
      });
    }
  }

  changeOrderStatus(data: any) {
    return this.httpClient.put<{ message: string }>(API_ORDER + 'change-order-status' , data);
  }
  getOrderDetails(orderId: string) {
    return this.httpClient.get<{ data: Order, message?: string }>(API_ORDER + 'get-order-details/' + orderId);
  }

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

  getAllTransactionByVendor(pagination ?: Pagination, select ?: string) {
    let params = new HttpParams();

    if (pagination) {
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
      if (select) {
        params = params.append('select', select);
      }
      return this.httpClient.post < {
        data: Order[],
        count: number,
        message ?: string
      } >
      (API_ORDER + 'get-all-transactions-by-vendor', {
        params
      });
    } else {
      if (select) {
        params = params.append('select', select);
      }
      return this.httpClient.post < {
        data: Order[],
        count: number,
        message ?: string
      } >
      (API_ORDER + 'get-all-transactions-by-vendor', {
        params
      });
    }
  }

}
