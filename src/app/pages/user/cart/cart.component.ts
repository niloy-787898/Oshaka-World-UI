import {Component, OnDestroy, OnInit} from '@angular/core';
import {Cart} from '../../../interfaces/common/cart.interface';
import {User} from '../../../interfaces/common/user.interface';
import {ProductService} from '../../../services/common/product.service';
import {Router} from '@angular/router';
import {UserService} from '../../../services/common/user.service';
import {UserDataService} from '../../../services/common/user-data.service';
import {CartService} from '../../../services/common/cart.service';
import {ReloadService} from '../../../services/core/reload.service';
import {UiService} from '../../../services/core/ui.service';
import {PricePipe} from '../../../shared/pipes/price.pipe';
import {Product} from '../../../interfaces/common/product.interface';
import {Subscription} from 'rxjs';
import {ShippingChargeService} from '../../../services/common/shipping-charge.service';
import {ShippingCharge} from '../../../interfaces/common/shipping-charge.interface';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  providers: [PricePipe]
})
export class CartComponent implements OnInit, OnDestroy {

  // Store data
  shippingCharge: ShippingCharge;
  carts: Cart[] = [];
  user: User;
  isUserAuth: boolean = false;

  // Subscriptions
  private subCartReload: Subscription;
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;
  private subDataFive: Subscription;

  constructor(
    private productService: ProductService,
    private router: Router,
    public userService: UserService,
    public userDataService: UserDataService,
    private cartService: CartService,
    private reloadService: ReloadService,
    private uiService: UiService,
    private shippingChargeService: ShippingChargeService,
    private pricePipe: PricePipe,
  ) {
  }

  ngOnInit(): void {
    // On user login status change
    this.userService.getUserStatusListener().subscribe(() => {
      this.isUserAuth = this.userService.getUserStatus();
      if (this.isUserAuth) {
        this.getLoggedInUserData();
      }
    });

    // Normal user status
    this.isUserAuth = this.userService.getUserStatus();
    if (this.isUserAuth) {
      this.getLoggedInUserData();
    }

    // CART FUNCTION
    this.subCartReload = this.reloadService.refreshCart$.subscribe(() => {
      this.getCartsItems();
    });
    // Base Data
    this.getCartsItems();
    this.getShippingCharge()
  }


  /**
   * HTTP REQ HANDLE
   * getLoggedInUserData()
   * getCartsItems()
   * updateCartQty()
   * deleteCartById()
   */

  private getLoggedInUserData() {
    const select = 'name';
    this.subDataOne = this.userDataService.getLoggedInUserData(select)
      .subscribe(res => {
        this.user = res.data;
      }, error => {
        console.log(error);
      });
  }

  private getCartsItems() {
    this.subDataTwo = this.cartService.getCartByUser()
      .subscribe(res => {
        this.carts = res.data;
        console.log('carts', this.carts)
      }, error => {
        console.log(error);
      });

  }

  private updateCartQty(cartId: string, data: any) {
    this.subDataThree = this.cartService.updateCartQty(cartId, data)
      .subscribe(() => {
        this.reloadService.needRefreshCart$();
      }, error => {
        console.log(error);
      });
  }

  deleteCartById(cartId: string) {
    this.subDataFour = this.cartService.deleteCartById(cartId)
      .subscribe(() => {
        this.reloadService.needRefreshCart$();
      }, error => {
        console.log(error);
      });
  }

  private getShippingCharge() {
    this.subDataFive = this.shippingChargeService.getShippingCharge()
      .subscribe(res => {
        console.log('res', res)
        this.shippingCharge = res.data;
      }, err => {
        console.log(err);
      });
  }


  /**
   * LOGICAL METHODS
   * onIncrementQty()
   * onDecrementQty()
   */

  onIncrementQty(cartId: string, index: number) {
    if (this.userService.getUserStatus()) {
      this.updateCartQty(cartId, {selectedQty: 1, type: 'increment'});
    }
  }

  onDecrementQty(cartId: string, index: number, sQty: number) {
    if (this.userService.getUserStatus()) {
      if (sQty === 1) {
        this.uiService.warn('Minimum quantity is 1');
        return;
      }
      this.updateCartQty(cartId, {selectedQty: 1, type: 'decrement'});
    }

  }


  /**
   * Calculation
   * cartSubTotal()
   * cartDiscountAmount()
   * cartTotal()
   */

  get cartSubTotal(): number {
    return this.carts.map(t => {
      return this.pricePipe.transform(t.product as Product, 'salePrice', t.selectedQty) as number;
    }).reduce((acc, value) => acc + value, 0);
  }

  get cartDiscountAmount(): number {
    return this.carts.map(t => {
      return this.pricePipe.transform(t.product as Product, 'discountAmount', t.selectedQty) as number;
    }).reduce((acc, value) => acc + value, 0);
  }

  get grandTotal(): number {
    return this.cartSubTotal + (this.shippingCharge ? this.shippingCharge.deliveryInDhaka : 0)
  }

  /**
   * ROUTING
   */
  onClickContinue() {
    if (this.carts.length) {
      this.router.navigate(['/checkout'])
    } else {
      this.uiService.warn('Your cart is empty')
    }
  }



  /**
   * NG ON DESTROY
   */
  ngOnDestroy() {
    if (this.subCartReload) {
      this.subCartReload.unsubscribe();
    }
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
    if (this.subDataFive) {
      this.subDataFive.unsubscribe();
    }

  }

}


