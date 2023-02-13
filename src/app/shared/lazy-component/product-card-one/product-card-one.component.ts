import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Product} from '../../../interfaces/common/product.interface';
import {Cart} from '../../../interfaces/common/cart.interface';
import {UserService} from '../../../services/common/user.service';
import {ReloadService} from '../../../services/core/reload.service';
import {CartService} from '../../../services/common/cart.service';
import {UiService} from '../../../services/core/ui.service';
import {Subscription} from 'rxjs';
import {DATABASE_KEY} from '../../../core/utils/global-variable';
import {MatDialog} from '@angular/material/dialog';
import {YoutubeVideoShowComponent} from '../../dialog-view/youtube-video-show/youtube-video-show.component';
import {WishListService} from '../../../services/common/wish-list.service';
import {WishList} from '../../../interfaces/common/wish-list.interface';
import {Router} from '@angular/router';
import {ProductService} from '../../../services/common/product.service';

@Component({
  selector: 'app-product-card-one',
  templateUrl: './product-card-one.component.html',
  styleUrls: ['./product-card-one.component.scss']
})
export class ProductCardOneComponent implements OnInit, OnDestroy {

  //Store Data
  carts: Cart[] = [];
  wishlists: WishList[] = [];
  cart: Cart = null;
  wishlist: WishList = null;
  @Input() data?: Product;

  productId = null;

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;
  private subReloadOne: Subscription;
  private subReloadTwo: Subscription;

  constructor(
    private userService: UserService,
    private reloadService: ReloadService,
    private cartService: CartService,
    private uiService: UiService,
    private dialog: MatDialog,
    private router: Router,
    private wishListService: WishListService,
    private productService: ProductService
    ) {
  }

  ngOnInit(): void {
    // CART FUNCTION STORED
    this.subReloadOne = this.cartService.refreshStoredCart$.subscribe(() => {
      this.carts = this.cartService.cartItems;
      this.checkCartList();
    });
    this.carts = this.cartService.cartItems;
    this.checkCartList();

    // WiSHLIST FUNCTION STORED
    this.subReloadTwo = this.wishListService.refreshStoredWishList$.subscribe(() => {
      this.wishlists = this.wishListService.wishListItems;
      this.checkWishList();
    });
    this.wishlists = this.wishListService.wishListItems;
    this.checkWishList();

    // WiSHLIST FUNCTION STORED
    this.subReloadTwo = this.wishListService.refreshStoredWishList$.subscribe(() => {
      this.wishlists = this.wishListService.wishListItems;
      this.checkWishList();
    });
    this.wishlists = this.wishListService.wishListItems;
    this.checkWishList();
  }

  /**
   * Button Click Event Handle
   * onAddToCart()
   * onAddToWishList()
   */

  onAddToCart(event: MouseEvent) {
    event.stopPropagation();
    const data: Cart = {
      product: this.data?._id,
      selectedQty: 1,
    };
    if (this.userService.getUserStatus()) {
      this.addToCartDB(data);
    } else {
      this.cartService.addCartItemToLocalStorage(data);
      this.reloadService.needRefreshCart$(true);
    }
  }

  onAddToWishList(event: MouseEvent) {
    event.stopPropagation();
    if (this.wishlist) {
      this.removeWishlistById(this.wishlist?._id);
    } else {
      const data: WishList = {
        product: this.data?._id,
        selectedQty: 1,
      };
      if (this.userService.getUserStatus()) {
        this.addToWishListDB(data);
      } else {
        this.router.navigate(['/login']);
        this.reloadService.needRefreshWishList$();
      }
    }

  }


  /**
   * HTTP REQ HANDLE
   * addToCartDB()
   * updateCartQty()
   * addToWishListDB()
   * removeWishlistById()
   */

  addToCartDB(data: Cart) {
    this.subDataOne = this.cartService.addToCart(data)
      .subscribe(res => {
        // console.log(res);
        this.uiService.success(res.message);
        this.reloadService.needRefreshCart$(true);
      }, error => {
        console.log(error);
      });
  }

  private updateCartQty(cartId: string, data: any) {
    this.subDataTwo = this.cartService.updateCartQty(cartId, data)
      .subscribe(() => {
        this.reloadService.needRefreshCart$(true);
      }, error => {
        console.log(error);
      });
  }

  addToWishListDB(data: Cart) {
    this.subDataThree = this.wishListService.addToWishList(data)
      .subscribe(res => {
        // console.log(res);
        this.uiService.success(res.message);
        this.reloadService.needRefreshWishList$();
      }, error => {
        console.log(error);
      });
  }

  public removeWishlistById(wishlistId: string) {
    this.subDataFour = this.wishListService.deleteWishListById(wishlistId)
      .subscribe(res => {
        this.reloadService.needRefreshWishList$();
        this.uiService.success(res.message);
      }, error => {
        console.log(error);
      });
  }


  /**
   * LOGICAL METHODS
   * onIncrementQty()
   * onDecrementQty()
   * checkCartList()
   * checkWishList()
   */

  onIncrementQty(event: MouseEvent) {
    event.stopPropagation();
    if (this.userService.getUserStatus()) {
      this.updateCartQty(this.cart._id, {selectedQty: 1, type: 'increment'});
    } else {
      const data = this.cartService.getCartItemFromLocalStorage();
      if (data != null) {
        const fIndex = data.findIndex(f => (f.product as string) === (this.cart.product as Product)._id);
        data[fIndex].selectedQty = data[fIndex].selectedQty + 1;
        localStorage.setItem(DATABASE_KEY.userCart, JSON.stringify(data));
        this.reloadService.needRefreshCart$(true);
      }
    }
  }

  onDecrementQty(event: MouseEvent) {
    event.stopPropagation();
    if (this.cart.selectedQty === 1) {
      this.uiService.warn('Minimum quantity is 1');
      return;
    }
    if (this.userService.getUserStatus()) {
      this.updateCartQty(this.cart._id, {selectedQty: 1, type: 'decrement'});
    } else {
      const data = this.cartService.getCartItemFromLocalStorage();
      if (data != null) {
        const fIndex = data.findIndex(f => (f.product as string) === (this.cart.product as Product)._id);
        data[fIndex].selectedQty = data[fIndex].selectedQty - 1;
        localStorage.setItem(DATABASE_KEY.userCart, JSON.stringify(data));
        this.reloadService.needRefreshCart$(true);
      }
    }
  }

  checkCartList() {
    this.cart = this.carts.find(f => (f.product as Product)._id === this.data?._id);
  }

  checkWishList() {
    this.wishlist = this.wishlists.find(f => (f.product as Product)._id === this.data?._id);
  }

  /**
   * DIALOG VIEW COMPONENT
   * openYoutubeVideoDialog()
   * getDiscountCourses()
   */
  public openYoutubeVideoDialog(event: MouseEvent, url: string) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(YoutubeVideoShowComponent, {
      data: {url: url},
      panelClass: ['theme-dialog', 'no-padding-dialog'],
      width: '98%',
      maxWidth: '700px',
      height: 'auto',
      maxHeight: '100vh',
      autoFocus: false,
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult && dialogResult.data) {
      }
    });
  }

  /**
   * compare product
   * addToCompareList()
   */
  addToCompareList(event: MouseEvent, product: Product) {
    event.stopPropagation();
    this.productId = product._id;
    this.productService.addToCompare(this.productId, product.category._id);
    this.reloadService.needRefreshCompareList$();
  }



  /**
   * NG ON DESTROY
   */
  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }
    if (this.subDataThree) {
      this.subDataThree.unsubscribe();
    }
    if (this.subDataFour) {
      this.subDataFour.unsubscribe();
    }
    if (this.subReloadOne) {
      this.subReloadOne.unsubscribe();
    }
    if (this.subReloadTwo) {
      this.subReloadTwo.unsubscribe();
    }
  }


}
