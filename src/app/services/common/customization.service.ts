import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Carousel} from "../../interfaces/common/carousel.interface";
import {environment} from "../../../environments/environment";
import {PageInfo} from "../../interfaces/common/page-info";


const API_CUSTOMIZATION = environment.apiBaseLink + '/api/customization/';

@Injectable({
  providedIn: 'root'
})
export class CustomizationService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * CAROUSEL
   */
  addNewCarousel(data: Carousel) {
    return this.httpClient.post<{ message: string }>(API_CUSTOMIZATION + 'add-new-carousel', data);
  }

  getAllCarousel() {
    return this.httpClient.get<{ data: Carousel[] }>(API_CUSTOMIZATION + 'get-all-carousel');
  }

  getSingleCarouselById(id: string) {
    return this.httpClient.get<{ data: Carousel }>(API_CUSTOMIZATION + 'get-single-carousel-by-id/' + id);
  }

  deleteCarouselById(id: string) {
    return this.httpClient.delete<{ message: string }>(API_CUSTOMIZATION + 'delete-carousel-by-id/' + id);
  }

  editCarouselById(data: any) {
    return this.httpClient.put<{ message: string }>(API_CUSTOMIZATION + 'edit-carousel-by-id', data);
  }



  /**
   * PAGE INFO
   */
  addPageInfo(data: PageInfo) {
    return this.httpClient.post<{ message: string }>(API_CUSTOMIZATION + 'add-page-info', data);
  }

  getPageInfoBySlug(slug: string) {
    return this.httpClient.get<{ data: PageInfo }>(API_CUSTOMIZATION + 'get-page-info/' + slug);
  }


}
