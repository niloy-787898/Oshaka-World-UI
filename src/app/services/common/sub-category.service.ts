import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {CategoryMenu} from '../../interfaces/common/category-menu.interface';
import {SubCategory} from "../../interfaces/common/sub-category.interface";


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

  getAllSubCategory() {
    return this.httpClient.get<{data: SubCategory[], message?: string}>(API_SUB_CATEGORY + 'get-all-sub-categories');
  }

  getSubCategoryByCategoryId(id: string) {
    return this.httpClient.get<{data: SubCategory[], message?: string}>(API_SUB_CATEGORY + 'get-all-by-parent/' + id);
  }

}
