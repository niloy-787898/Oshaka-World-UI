import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {FilterData} from '../../interfaces/core/filter-data';
import {SubCategory} from '../../interfaces/common/sub-category.interface';
import {CategoryMenu} from '../../interfaces/common/category-menu.interface';

const API_SUB_CATEGORY = environment.apiBaseLink + '/api/sub-category/';


@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * getSubCategoriesGroupByCategory
   */

  getSubCategoriesGroupByCategory() {
    return this.httpClient.get<{ data: CategoryMenu[], count: number, success: boolean }>(API_SUB_CATEGORY + 'get-subcategories-group-by-category');
  }

}
