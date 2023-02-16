import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {VendorService} from "../services/common/vendor.service";


@Injectable()
export class AuthVendorInterceptor implements HttpInterceptor {

  constructor(private vendorService: VendorService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.vendorService.getVendorToken();
    const authRequest = req.clone({
      headers: req.headers.set('VendorAuthorization', 'Bearer ' + authToken)
    });
    return next.handle(authRequest);
  }
}
