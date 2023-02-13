import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Product, ProductFilterGroup} from '../../interfaces/common/product.interface';
import {FilterData} from '../../interfaces/core/filter-data';
import {UiService} from '../core/ui.service';

const API_PRODUCT = environment.apiBaseLink + '/api/product/';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private httpClient: HttpClient,
    private uiService: UiService
  ) {
  }

  /**
   * getAllProducts
   * getProductByIds
   * getProductById
   */

  getAllProducts(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Product[], filterGroup: ProductFilterGroup, count: number, success: boolean }>(API_PRODUCT + 'get-all', filterData, {params});
  }


  getProductByIds(ids: string[], select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.post<{ data: Product[], count: number, success: boolean }>(API_PRODUCT + 'get-products-by-ids', {ids}, {params});
  }

  getProductById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Product, message: string, success: boolean }>(API_PRODUCT+'slug/' + id, {params});
  }

  getProductBySlug(slug: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Product, message: string, success: boolean }>(API_PRODUCT+'slug/' + slug, {params});
  }

  getProductBySlugOnlyDescription(slug: string, select?: string) {
    let params = new HttpParams();
    return this.httpClient.get<{ data: Product, message: string, success: boolean }>(API_PRODUCT+'slug-description/' + slug, {params});
  }


  /**
   * COMPARE LIST with LOCAL STORAGE
   */

  addToCompare(productId: string, categoryId?: string) {
    // console.log(product);
    const items = JSON.parse(localStorage.getItem('compareListV2'));
    let compareListV2;
    if (items === null) {
      compareListV2 = [];
      compareListV2.push({_id: productId, category: categoryId});
      this.uiService.success('Product added to compare list');
    } else {
      compareListV2 = items;
      const fIndex = compareListV2.findIndex((o) => o._id === productId);
      const fIndexCat = compareListV2.findIndex((o) => o.category === categoryId);
      if (fIndex === -1) {
        if (compareListV2.length !== 3) {
          if (fIndexCat === -1) {
            this.uiService.wrong('Please add same category product to compare');
          } else {
            compareListV2.push({_id: productId, category: categoryId});
            this.uiService.success('Product added to compare list');
          }

        }
        else {
          this.uiService.wrong('Your compare list is full');
        }
      } else {
        this.uiService.warn('This product already in compare list');
      }
    }
    localStorage.setItem('compareListV2', JSON.stringify(compareListV2));
  }


  getCompareList(): string[] {
    const list = localStorage.getItem('compareListV2');
    if (list === null) {
      return [];
    }
    return JSON.parse(list) as any[];
  }

  deleteCompareItem(id: string) {
    const items = JSON.parse(localStorage.getItem('compareListV2'));
    const filtered = items.filter(el => el._id !== id);
    if (filtered && filtered.length){
      localStorage.setItem('compareListV2', JSON.stringify(filtered));
    } else {
      localStorage.removeItem('compareListV2');
    }
  }

  getSpecificProductsById(ids: string[], select?: string) {
    return this.httpClient.post<{ data: Product[] }>(API_PRODUCT + 'get-specific-products-by-ids', {ids, select});
  }


}
