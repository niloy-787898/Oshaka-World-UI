import {Injectable} from '@angular/core';

import {Subject} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';


import {NgxSpinnerService} from 'ngx-spinner';
import {UiService} from "../core/ui.service";
import {Vendor} from "../../interfaces/common/vendor";
import {environment} from "../../../environments/environment";
import {DATABASE_KEY} from "../../core/utils/global-variable";


const API_URL_VENDOR = environment.apiBaseLink + '/api/vendor/';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  private token: string;
  private isVendor = false;
  private vendorStatusListener = new Subject<boolean>();
  // Hold The Count Time..
  private tokenTimer: any;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private uiService: UiService,
    private spinner: NgxSpinnerService,
  ) {
  }


  // For New User Registration..
  vendorRegistration(regData: Vendor) {
    return this.httpClient.post<{ vendorId: string, message: string }>(API_URL_VENDOR + 'signup', regData);
  }

  // For Login User..
  vendorLogin(data: any) {
    this.httpClient.post<{ message: string, token: string, tokenExpiredIn: number }>(API_URL_VENDOR + 'login', data)
      .subscribe(response => {
        const getToken = response.token;
        this.token = getToken;
        // Make User Auth True..
        if (getToken) {
          this.isVendor = true;
          this.vendorStatusListener.next(true);
          // For Token Expired Time..
          const tokenExpiredInDuration = response.tokenExpiredIn;
          this.setSessionTimer(tokenExpiredInDuration);
          // Save Login Time & Expiration Time & Token to Local Storage..
          const now = new Date();
          const expirationDate = new Date(now.getTime() + tokenExpiredInDuration * 1000);
          this.saveVendorData(getToken, expirationDate);
          this.spinner.hide();
          // Snack bar..
          this.uiService.success('Login Success!');
          // Navigate..
          this.router.navigate([environment.vendorBaseUrl]);
        } else {
          this.uiService.success(response.message);
        }
      }, error => {
        this.spinner.hide();
        this.vendorStatusListener.next(false);
        console.log(error);
      });
  }


  // That will Be Call First on Main App Component For Auto Login..
  autoVendorLoggedIn() {
    const authInformation = this.getVendorData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expiredDate.getTime() - now.getTime();
    // console.log(authInformation, expiresIn);
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.vendorStatusListener.next(true);
      this.isVendor = true;
      this.setSessionTimer(expiresIn / 10000);
    }
  }

  // Vendor LogOut..
  vendorLogOut() {
    this.token = null;
    this.isVendor = false;
    this.vendorStatusListener.next(false);
    // Clear Token from Storage..
    this.clearVendorData();
    // Clear The Token Time..
    clearTimeout(this.tokenTimer);
    // Navigate..
    this.router.navigate([environment.vendorLoginUrl]);
  }


  // User Update Listener..
  // getUserUpdateListener() {
  //   return this.userUpdated.asObservable();
  // }

  // For Set Time Duration in ms..
  private setSessionTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      // this.userLogOut();
    }, duration * 1000); // 1s = 1000ms
    // console.log('Setting Time: ' + duration);
  }

// For Save Token on Browser Storage..
  protected saveVendorData(token: string, expiredDate: Date) {
    localStorage.setItem(DATABASE_KEY.loginTokenVendor, token);
    localStorage.setItem(DATABASE_KEY.loggInSessionVendor, expiredDate.toISOString());
  }

  // For Clear Token on Browser Storage..
  protected clearVendorData() {
    localStorage.removeItem(DATABASE_KEY.loginTokenVendor);
    localStorage.removeItem(DATABASE_KEY.loggInSessionVendor);
  }

  // Get Vendor Data from Browser Storage..
  protected getVendorData() {
    const token = localStorage.getItem(DATABASE_KEY.loginTokenVendor);
    const expirationDate = localStorage.getItem(DATABASE_KEY.loggInSessionVendor);

    if (!token && !expirationDate) {
      // @ts-ignore
      return;
    }
    return {
      token,
      expiredDate: new Date(expirationDate)
    };
  }

  // For Get Login Token..
  getVendorToken() {
    return this.token;
  }

  // For Get Auth status listener to Other..
  getVendorStatusListener() {
    return this.vendorStatusListener.asObservable();
  }

  getVendorStatus() {
    return this.isVendor;
  }

  /**
   * Get Logged In Vendor Data
   */

  getLoggedInVendor(select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
      return this.httpClient.get<{ data: Vendor }>(API_URL_VENDOR + 'get-logged-in-vendor-data', {params});
    } else {
      return this.httpClient.get<{ data: Vendor }>(API_URL_VENDOR + 'get-logged-in-vendor-data');
    }
  }

  /**
   * CHECK USER PHONE
   */

  checkAndGetVendorByPhone(phoneNo: string) {
    return this.httpClient.get<{ data: boolean, message: string }>(API_URL_VENDOR + 'check-vendor-for-registration' + phoneNo);
  }

  /*
  * UPDATE VENDOR BY ID
   */
  updateVendorById(vendorId: string) {
    return this.httpClient.post<{ message: string }>(API_URL_VENDOR + 'update-vendor-by-id', vendorId);
  }

  deleteVendor(id: string) {
    return this.httpClient.delete<{ message?: string }>(API_URL_VENDOR + 'delete-vendor-by-id/' + id);
  }

}
