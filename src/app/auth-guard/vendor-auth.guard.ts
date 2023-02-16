import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {VendorService} from "../services/common/vendor.service";

@Injectable({
  providedIn: 'root'
})
export class VendorAuthGuard implements CanActivate {
  constructor(private vendorService: VendorService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const isVendor = this.vendorService.getVendorStatus();
    if (!isVendor) {
      this.router.navigate([environment.vendorLoginUrl]);
    }
    return isVendor;
  }
}
