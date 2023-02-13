import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {FilterData} from '../../interfaces/core/filter-data';
import {PromoOffer} from '../../interfaces/common/promo-offer.interface';
import {Product} from "../../interfaces/common/product.interface";

const API_BEST_DEAL = environment.apiBaseLink + '/api/promo-offer/';


@Injectable({
  providedIn: 'root'
})
export class PromoOfferService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * getPromoOfferSingle
   */

  getPromoOfferSingle(select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: PromoOffer, message: string, success: boolean }>(API_BEST_DEAL + 'promotional-offer', {params});
  }


  getAllPromoOffers(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: PromoOffer[], count: number, success: boolean }>(API_BEST_DEAL + 'get-all', filterData, {params});
  }

  getPromoOfferById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: PromoOffer, message: string, success: boolean }>(API_BEST_DEAL + id, {params});
  }

  getProductDetailsByPromoandProduct(id: string,product_id: string) {
    return this.httpClient.get<{ data: any, message: string, success: boolean }>(API_BEST_DEAL + id +'/'+ product_id);
  }

  getPromoOfferBySlug(slug: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: PromoOffer, message: string, success: boolean }>(API_BEST_DEAL+"slug/" + slug, {params});
  }

}
