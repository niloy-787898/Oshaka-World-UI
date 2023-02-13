import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {User} from '../../interfaces/common/user.interface';
import {FilterData} from '../../interfaces/core/filter-data';
import {Pagination} from '../../interfaces/core/pagination';
import {Address} from '../../interfaces/common/address.interface';


const API_USER = environment.apiBaseLink + '/api/user/';


@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addUser
   * insertManyUser
   * getAllUsers
   * getUserById
   * updateUserById
   * updateMultipleUserById
   * deleteUserById
   * deleteMultipleUserById
   */

  addUser(data: User) {
    return this.httpClient.post<ResponsePayload>
    (API_USER + 'signup', data);
  }

  insertManyUser(data: User, option?: any) {
    const mData = {data, option}
    return this.httpClient.post<ResponsePayload>
    (API_USER + 'insert-many', mData);
  }

  getAllUsers(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: User[], count: number, success: boolean }>(API_USER + 'get-all', filterData, {params});
  }

  getUserById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: User, message: string, success: boolean }>(API_USER + id, {params});
  }

  updateUserById(id: string, data: User) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_USER + 'update-data/' + id, data);
  }

  updateMultipleUserById(ids: string[], data: User) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_USER + 'update-multiple-data-by-id', mData);
  }

  deleteUserById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_USER + 'delete-data/' + id, {params});
  }

  deleteMultipleUserById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_USER + 'delete-multiple-data-by-id', {ids: ids}, {params});
  }

  getLoggedInUserData(select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }

    return this.httpClient.get<{ data: User }>(API_USER + 'logged-in-user-data', {params});
  }

  updateLoggedInUserInfo(data: User) {
    return this.httpClient.put<ResponsePayload>(API_USER + 'update-logged-in-user', data);
  }

  changeLoggedInUserPassword(data: { password: string, oldPassword: string }) {
    return this.httpClient.put<ResponsePayload>(API_USER + 'change-logged-in-user-password', data);
  }

  /**
   * User Address Api
   * getAllAddress()
   * deleteAddress()
   * addAddress()
   */

  addAddress(address: Address) {
    console.log('service address', address)
    return this.httpClient.post<{ message: string }>(API_USER + 'add-address', address);
  }


  getUserAddress() {
    return this.httpClient.get<{ data: Address[], success: boolean, message?: string }>(API_USER + 'get-user-address');
  }

  editAddress(id: string, data: Address) {
    return this.httpClient.put<{ message: string }>(API_USER + 'edit-address/' + id, data);
  }


  deleteAddressById(addressId: string) {
    return this.httpClient.delete<{ message: string }>(API_USER + 'delete-address/' + addressId);
  }


}
