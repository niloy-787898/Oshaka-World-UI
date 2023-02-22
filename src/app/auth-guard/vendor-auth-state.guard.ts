import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {VendorService} from "../services/common/vendor.service";


@Injectable({
  providedIn: 'root'
})
export class VendorAuthStateGuard implements CanActivate {
  constructor(
    private vendorService: VendorService,
    private router: Router
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const isVendor = this.vendorService.getVendorStatus();
    console.log(isVendor);
    
    if (!isVendor) {
      return true;
    }
    return this.router.navigate([environment.vendorBaseUrl]);
  }
}
