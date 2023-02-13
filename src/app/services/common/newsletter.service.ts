import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Newsletter} from '../../interfaces/common/newsletter.interface';
import {FilterData} from '../../interfaces/core/filter-data';

const API_NEWSLETTER = environment.apiBaseLink + '/api/newsletter/';


@Injectable({
  providedIn: 'root'
})
export class NewsletterService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addNewsletter
   */

  addNewsletter(data: Newsletter) {
    return this.httpClient.post<ResponsePayload>
    (API_NEWSLETTER + 'add', data);
  }


}
