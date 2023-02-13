import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReloadService {
  private refreshData = new Subject<void>();
  private refreshWishList = new Subject<void>();
  private refreshPcBuild = new Subject<void>();
  private refreshCompareList = new Subject<void>();
  private refreshCart = new BehaviorSubject<boolean>(false);


  /**
   * REFRESH COMPARE DATA
   */
  get refreshCompareList$() {
    return this.refreshCompareList;
  }

  needRefreshCompareList$() {
    this.refreshCompareList.next();
  }
  // /**
  //  * LocalCart
  //  */
  // get refreshLocalCart$() {
  //   return this.refreshLocalCart;
  // }
  /**
   * REFRESH PCBUILD DATA
   */
  get refreshPcBuild$() {
    return this.refreshPcBuild;
  }
  needRefreshPcBuild$() {
    this.refreshPcBuild.next();
  }
  /**
   * REFRESH GLOBAL DATA
   */
  get refreshData$() {
    return this.refreshData;
  }
  needRefreshData$() {
    this.refreshData.next();
  }

  /**
   * REFRESH GLOBAL DATA
   */
  get refreshWishList$() {
    return this.refreshWishList;
  }
  needRefreshWishList$() {
    this.refreshWishList$.next();
  }


  /**
   * CART
   */
  get refreshCart$() {
    return this.refreshCart;
  }

  needRefreshCart$(data?: boolean) {
    if (data && data === true) {
      this.refreshCart.next(data);
    } else {
      this.refreshCart.next(false);
    }
  }

}
