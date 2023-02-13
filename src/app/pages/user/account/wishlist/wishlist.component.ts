import {Component, OnDestroy, OnInit} from '@angular/core';
// import {UserDataService} from '../../../../services/user-data.service';
// import {ReloadService} from '../../../../services/reload.service';
// import {UiService} from 'src/app/services/ui.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {NgxSpinnerService} from 'ngx-spinner';
import {WishListService} from '../../../../services/common/wish-list.service';
import {UiService} from '../../../../services/core/ui.service';
import {ReloadService} from '../../../../services/core/reload.service';
import {WishList} from '../../../../interfaces/common/wish-list.interface';

// import {Wishlist} from '../../../../interfaces/wishlist';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit, OnDestroy {

  private subAcRoute: Subscription;

  wishlists: WishList[] = [];

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 5;
  totalProductsStore = 0;

  constructor(
    // private userDataService: UserDataService,
    public reloadService: ReloadService,
    private uiService: UiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private wishListService: WishListService,
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshWishList$.subscribe(() => {
      this.getWishListByUser();
    });

    this.subAcRoute = this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam['page']) {
        this.currentPage = qParam['page'];
      } else {
        this.currentPage = 1;
      }
      this.getWishListByUser();
    });
  }

  public removeWishlistById(wishlistId: string) {
    this.wishListService.deleteWishListById(wishlistId)
      .subscribe(res => {
        this.reloadService.needRefreshWishList$();
        this.uiService.success(res.message);
      }, error => {
        console.log(error);
      });
    this.reloadService.needRefreshData$();
  }

  private getWishListByUser() {
    this.spinner.show();
    this.wishListService.getWishListByUser()
      .subscribe(res => {
        this.spinner.hide();
        this.wishlists = res.data;
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  /**
   * PAGINATION CHANGE
   */
  public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}});
  }


  /**
   * ON DESTROY
   */
  ngOnDestroy() {
    if (this.subAcRoute) {
      this.subAcRoute.unsubscribe();
    }
  }
}
