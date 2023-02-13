import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Category} from '../../interfaces/common/category.interface';
import {FilterData} from '../../interfaces/core/filter-data';

const API_CATEGORY = environment.apiBaseLink + '/api/category/';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * getAllCategories
   */

  getAllCategories(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Category[], count: number, success: boolean }>(API_CATEGORY + 'get-all', filterData, {params});
  }


}
