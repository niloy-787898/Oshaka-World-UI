import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {UiService} from '../../services/core/ui.service';
import {UserService} from '../../services/common/user.service';
import {ProductService} from '../../services/common/product.service';
import {Product} from '../../interfaces/common/product.interface';
import {CartService} from '../../services/common/cart.service';
import {ReloadService} from '../../services/core/reload.service';
import {Cart} from '../../interfaces/common/cart.interface';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit, OnDestroy {

  // compareListV2: Product[] = []
  compareListV2: string[] = [];
  compareListFromDB: Product[] = [];
  ids: any[] = [];

  // EMPTY CHECK
  isEmpty = true;

  //Subscribe
  private subReloadOne: Subscription
  private subRouteOne: Subscription
  private subRouteTwo: Subscription

  constructor(
    private productService: ProductService,
    private reloadService: ReloadService,
    private spinner: NgxSpinnerService,
    private cartService: CartService,
    private uiService: UiService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.subReloadOne = this.reloadService.refreshCompareList$.subscribe(() => {
      this.getCompareList();
    });

    // GET DATA
    this.getCompareList();
  }


  /**
   * HTTP REQ
   * getCompareListFromDB()
   * addItemToCartDB()
   */
  getCompareListFromDB() {
    // @ts-ignore
    const mCompareList = this.compareListV2.map(m => m._id);
    this.subRouteOne = this.productService.getProductByIds(mCompareList)
      .subscribe( res => {
        this.spinner.hide();
        this.compareListFromDB = res.data;

        this.isEmpty = false;
      }, error => {
        this.spinner.hide();
        this.isEmpty = true;
        console.log(error);
      });
  }

  addItemToCartDB(data: Cart) {
    this.subRouteTwo = this.cartService.addToCart(data)
      .subscribe(res => {
        // console.log(res);
        this.uiService.success(res.message);
        this.reloadService.needRefreshCart$();
      }, error => {
        console.log(error);
      });
  }

  /**
   * HANDLE LOCAL STORAGE DATA
   * getCompareList()
   * removeItem()
   */

  getCompareList() {
    this.spinner.show();
    this.compareListV2 = this.productService.getCompareList();
    if (this.compareListV2 && this.compareListV2.length > 0) {
      this.getCompareListFromDB();
    } else {
      this.spinner.hide();
      this.isEmpty = true;
    }
  }

  removeItem(id: string) {
    this.productService.deleteCompareItem(id);
    this.reloadService.needRefreshCompareList$();
  }

  /**
   * ADD to CART
   */

  addToCart(productId: string) {
    // event.stopPropagation();

    const data: Cart = {
      product: productId,
      selectedQty: 1,
    };


    if (this.userService.getUserStatus()) {
      this.addItemToCartDB(data);
    } else {
      this.cartService.addCartItemToLocalStorage(data);
      this.reloadService.needRefreshCart$();
    }
  }

  /**
   * NG ON DESTROY
   */
  ngOnDestroy() {
    if(this.subReloadOne){
      this.subReloadOne.unsubscribe()
    }
    if(this.subRouteOne){
      this.subRouteOne.unsubscribe()
    }
    if(this.subRouteTwo){
      this.subRouteTwo.unsubscribe()
    }
  }


}
