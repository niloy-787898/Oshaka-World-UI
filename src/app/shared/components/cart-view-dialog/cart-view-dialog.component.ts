import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {DATABASE_KEY} from '../../../core/utils/global-variable';
import {CartService} from "../../../services/common/cart.service";
import {ReloadService} from "../../../services/core/reload.service";
import {ProductService} from "../../../services/common/product.service";
import {Cart} from "../../../interfaces/common/cart.interface";


@Component({
  selector: 'app-coupon-offer-dialog',
  templateUrl: './cart-view-dialog.component.html',
  styleUrls: ['./cart-view-dialog.component.scss']
})
export class CartViewDialogComponent implements OnInit {

  carts: Cart[] = [];

  constructor(
    public dialogRef: MatDialogRef<CartViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cartService: CartService,
    private reloadService: ReloadService,
    private productService: ProductService,
  ) {
  }

  ngOnInit(): void {
    if (this.data) {
      this.carts = this.data;
    }
    this.reloadService.refreshCart$.subscribe(() => {
      this.getCarsItemFromLocal();
    });
  }

  /**
   * CART FUNCTIONALITY
   */
  onDeleteCartItem(cartId: string, product: string) {
    this.cartService.deleteCartItemFromLocalStorage(product);
    this.reloadService.needRefreshCart$() ;
  }

  incrementQty(cartId: string, index: number) {
    const data = this.cartService.getCartItemFromLocalStorage();
    if (data != null) {
      data[index].selectedQty = data[index].selectedQty + 1;
      localStorage.setItem(DATABASE_KEY.userCart, JSON.stringify(data));
      this.reloadService.needRefreshCart$();
    }
  }

  decrementQty(cartId: string, index: number, sQty: number) {
    const data = this.cartService.getCartItemFromLocalStorage();
    if (data[index].selectedQty === 1) {
      return;
    }
    if (data != null) {
      data[index].selectedQty = data[index].selectedQty - 1;
      localStorage.setItem(DATABASE_KEY.userCart, JSON.stringify(data));
      this.reloadService.needRefreshCart$();
    }

  }

  private getCarsItemFromLocal() {
    const items = this.cartService.getCartItemFromLocalStorage();

    if (items && items.length > 0) {
      const ids: string[] = items.map(m => m.product as string);
      this.productService.getSpecificProductsById(ids, 'productName productSlug  price discountType discountAmount  quantity images')
        .subscribe(res => {
          const products = res.data;
          if (products && products.length > 0) {
            this.carts = items.map(t1 => ({...t1, ...{product: products.find(t2 => t2._id === t1.product)}}));
          }
        });
    } else {
      this.carts = [];
    }
  }


  /**
   * ADD OR REMOVE CART
   */
  onUpdateCart() {
    this.cartService.syncLocalCartItems();
    this.dialogRef.close();
  }

  onRemove() {
    this.cartService.deleteAllCartFromLocal();
    this.dialogRef.close();
  }

}
