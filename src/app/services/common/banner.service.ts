import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Pagination} from "../../interfaces/core/pagination";
import {Banner} from "./banner";
import {environment} from "../../../environments/environment";

const API_BANNER = environment.apiBaseLink + '/api/banner/';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  constructor(
    private http: HttpClient,
  ) {
  }

  /**
   * Image Folder
   */

  addNewBanner(data: Banner) {
    return this.http.post<{ message: string }>(API_BANNER + 'add-new-banner', data);
  }


  getAllBanner(pagination?: Pagination, bannerType?: string) {
    let params = new HttpParams();
    if (pagination) {
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
      if (bannerType) {
        params = params.append('bannerType', bannerType);
      }

      return this.http.get<{ data: Banner[], count: number, message?: string }>
      (API_BANNER + 'get-all-banner-list', {params});
    } else {
      if (bannerType) {
        params = params.append('bannerType', bannerType);
      }
      return this.http.get<{ data: Banner[], count: number, message?: string }>
      (API_BANNER + 'get-all-banner-list', {params});
    }
  }

  getSingleBannerById(id: string, selectProductField?: string) {
    let params = new HttpParams();
    if (selectProductField) {
      params = params.append('select', selectProductField);
    }
    return this.http.get<{ data: Banner, message?: string }>(API_BANNER + 'get-banner-by-id/' + id, {params});
  }


  editBanner(data: Banner) {
    return this.http.put<{ message: string }>(API_BANNER + 'edit-banner', data);
  }

  deleteBannerById(id: string) {
    return this.http.delete<{ message: string }>(API_BANNER + 'delete-banner-by-id/' + id);
  }


}
