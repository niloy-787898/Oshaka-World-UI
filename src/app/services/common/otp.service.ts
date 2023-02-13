import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Tag} from '../../interfaces/common/tag.interface';
import {FilterData} from '../../interfaces/core/filter-data';
import {Otp} from '../../interfaces/common/otp.interface';

const API_OTP = environment.apiBaseLink + '/api/otp/';


@Injectable({
  providedIn: 'root'
})
export class OtpService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * generateOtpWithPhoneNo()
   * validateOtpWithPhoneNo()
   */

  generateOtpWithPhoneNo(data: Otp) {
    return this.httpClient.post<ResponsePayload>
    (API_OTP + 'generate-otp', data);
  }

  validateOtpWithPhoneNo(data: { phoneNo: string, code: string }) {
    return this.httpClient.post<ResponsePayload>
    (API_OTP + 'validate-otp', data);
  }


}
