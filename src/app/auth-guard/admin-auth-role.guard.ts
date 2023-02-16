import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {StoredDataService} from "../interfaces/common/stored-data.service";


@Injectable({
  providedIn: 'root'
})
export class AdminAuthRoleGuard implements CanActivate {
  constructor(private storedDataService: StoredDataService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const hasAccess = this.storedDataService.checkRoleAccess(state.url);
    console.log('Iam on this' + hasAccess);
    console.log('Iam on this' + state.url);
    if (!hasAccess) {
      this.router.navigate(['/admin/dashboard']);
    }
    return hasAccess;
  }
}
