import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Pagination} from "../../interfaces/core/pagination";
import {ImageGallery} from "../../interfaces/gallery/image-gallery";
import {environment} from "../../../environments/environment";
import { Gallery } from 'src/app/interfaces/gallery/gallery.interface';
import { ResponsePayload } from 'src/app/interfaces/core/response-payload.interface';
import { FilterData } from 'src/app/interfaces/core/filter-data';


const API_GALLERY = environment.apiBaseLink + '/api/gallery/';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  constructor(
    private http: HttpClient,
  ) {
  }

  /**
   * IMAGE GALLEY
   */

  addNewGalleryData(data: ImageGallery) {
    return this.http.post<{ message: string }>(API_GALLERY + 'add-new-gallery', data);
  }

  insertManyGallery(data: Gallery[], option?: any) {
    const mData = {data, option}
    return this.http.post<ResponsePayload>
    (API_GALLERY + 'insert-many', mData);
  }

  getAllGalleries(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.http.post<{ data: Gallery[], count: number, success: boolean }>(API_GALLERY + 'get-all', filterData, {params});
  }

  getSearchImages(query: string, pagination?: Pagination) {
    let params = new HttpParams();
    params = params.append('q', query);

    if (pagination) {
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
    }
    return this.http.get<{ data: ImageGallery[], count: number, message?: string }>(API_GALLERY + 'search-image-by-regex', {params});

  }

  editGalleryData(data: ImageGallery) {
    return this.http.put<{ message: string }>(API_GALLERY + 'edit-gallery-by-id', data);
  }

  deleteGalleryData(id: string) {
    return this.http.delete<{ message: string }>(API_GALLERY + 'delete-gallery-by-id/' + id);
  }

  deleteGalleryDataMulti(ids: string[]) {
    return this.http.post<{ message: string }>(API_GALLERY + 'delete-gallery-images-multi', {data: ids});
  }




}
