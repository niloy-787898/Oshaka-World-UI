import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Cart} from '../../interfaces/common/cart.interface';
import {DATABASE_KEY} from '../../core/utils/global-variable';
import {ReloadService} from '../core/reload.service';
import {Subject} from 'rxjs';

const API_CART = environment.apiBaseLink + '/api/cart/';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  /**
   * REFRESH LOCAL STORED CART
   */
  private refreshStoredCart = new Subject<void>();

  /**
   * CART WITH DB
   */
  addItemToUserCart(data: Cart) {
    return this.httpClient.post<{ message: string }>(API_CART + 'add-to-cart', data);
  }

  get refreshStoredCart$() {
    return this.refreshStoredCart;
  }

  needRefreshStoredCart$() {
    this.refreshStoredCart.next();
  }

  // Store Data
  private cartList: Cart[] = [];

  constructor(
    private httpClient: HttpClient,
    private reloadService: ReloadService,
  ) {
  }

  /**
   * addToCart
   * getCartByUserId
   * deleteCartById
   * updateCartById
   * updateCartQty
   */

  syncLocalCartItems() {
    const items: Cart[] = this.getCartItemFromLocalStorage();
    if (items.length > 0) {
      let i = 0;
      items.forEach((d: Cart) => {
        this.addItemToUserCart(d).subscribe(() => {
          i += 1;
          if (i === items.length) {
            this.reloadService.needRefreshCart$();
            this.deleteAllCartFromLocal();
          }
        });
      });
    }
  }


  addToCart(data: Cart) {
    return this.httpClient.post<ResponsePayload>
    (API_CART + 'add-to-cart', data);
  }

  addToCartMultiple(data: Cart[]) {
    return this.httpClient.post<ResponsePayload>
    (API_CART + 'add-to-cart-multiple', data);
  }

  getCartByUser() {
    return this.httpClient.get<{ data: Cart[], count: number, success: boolean }>(API_CART + 'get-carts-by-user');
  }

  deleteCartById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_CART + 'delete/' + id, {params});
  }

  updateCartById(id: string, data: Cart) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_CART + 'update/' + id, data);
  }

  updateCartQty(id: string, data: { selectedQty: number, type: string }) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_CART + 'update-qty/' + id, data);
  }


  /**
   * CART LOCAL STORAGE
   * addCartItemToLocalStorage()
   * getCartItemFromLocalStorage()
   * deleteCartItemFromLocalStorage()
   * deleteAllCartFromLocal()
   */
  addCartItemToLocalStorage(cartItem: Cart) {
    // console.log(product);
    const items = JSON.parse(localStorage.getItem(DATABASE_KEY.userCart));

    let carts;

    if (!items) {
      carts = [];
      carts.push(cartItem);
    } else {
      carts = items;
      const fIndex = carts.findIndex((o) => o.product === cartItem.product);
      if (fIndex === -1) {
        carts.push(cartItem);
      } else {
        carts[fIndex].selectedQty += 1;
      }
    }
    localStorage.setItem(DATABASE_KEY.userCart, JSON.stringify(carts));
  }

  getCartItemFromLocalStorage(): Cart[] {
    const carts = localStorage.getItem(DATABASE_KEY.userCart);
    if (carts === null) {
      return [];
    }
    return JSON.parse(carts) as Cart[];
  }

  deleteCartItemFromLocalStorage(id: string) {
    const items = JSON.parse(localStorage.getItem(DATABASE_KEY.userCart));
    const filtered = items.filter(el => el.product !== id);
    localStorage.setItem(DATABASE_KEY.userCart, JSON.stringify(filtered));
  }

  deleteAllCartFromLocal(refresh?: boolean) {
    localStorage.removeItem(DATABASE_KEY.userCart);
    this.reloadService.needRefreshCart$(refresh ? refresh : false);
  }

  /**
   * CART STORE & GET LOCALLY
   * updateCartList()
   * cartItems()
   */
  public updateCartList(data: Cart[]) {
    this.cartList = data;
    this.needRefreshStoredCart$();
  }

  public get cartItems() {
    return [...this.cartList]
  }


}
