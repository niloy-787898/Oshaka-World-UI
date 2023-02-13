import { CategorySlideComponent } from './category-slide/category-slide.component';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, pluck, Subscription, switchMap } from 'rxjs';
import { ProductService } from '../../services/common/product.service';
import { Product } from '../../interfaces/common/product.interface';
import { Cart } from '../../interfaces/common/cart.interface';
import { UserService } from '../../services/common/user.service';
import { CartService } from '../../services/common/cart.service';
import { UserDataService } from '../../services/common/user-data.service';
import { ReloadService } from '../../services/core/reload.service';
import { User } from '../../interfaces/common/user.interface';
import { UiService } from '../../services/core/ui.service';
import { PricePipe } from '../../shared/pipes/price.pipe';
import { DATABASE_KEY } from '../utils/global-variable';
import { WishListService } from '../../services/common/wish-list.service';
import { NgForm } from '@angular/forms';
import { FilterData } from '../../interfaces/core/filter-data';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Pagination } from '../../interfaces/core/pagination';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [PricePipe],
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('categorySlide') categorySlide!: CategorySlideComponent;
  // Store data
  carts: Cart[] = [];
  wishLists: Cart[] = [];
  user: User;
  isUserAuth: boolean = false;
  categoryBar = false;

  // SEARCH AREA
  searchProducts: Product[] = [];

  // SEARCH AREA
  overlay = false;
  isOpen = false;
  isFocused = false;
  isLoading = false;
  isSelect = false;
  searchQuery = null;
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('searchInputMobile') searchInputMobile: ElementRef;

  // Placeholder Animation
  timeOutOngoing: any;
  char = 0;
  txt = 'Search products in oshaka world...';

  // Header Logic
  headerFixed = false;
  headerTop = true;
  resSearchShow = false;
  cartSlide = false;
  cartAnimate = false;

  // productStatus
  status: number = 0;

  compareItemsCount = 0;

  // Subscriptions
  private subForm: Subscription;
  private headerHideRoute!: Subscription;

  constructor(
    private productService: ProductService,
    private router: Router,
    public userService: UserService,
    public userDataService: UserDataService,
    private cartService: CartService,
    private reloadService: ReloadService,
    private uiService: UiService,
    private pricePipe: PricePipe,
    private wishListService: WishListService
  ) {}

  ngOnInit(): void {
    // UI Function
    // this.scrollTopToStart();
    // this.headerControll();

    // On user login status change
    this.userService.getUserStatusListener().subscribe(() => {
      this.isUserAuth = this.userService.getUserStatus();
      if (this.isUserAuth) {
        this.getLoggedInUserData();
      }
    });

    this.categoryBarControll();

    // Normal user status
    this.isUserAuth = this.userService.getUserStatus();
    if (this.isUserAuth) {
      this.getLoggedInUserData();
    }

    // CART FUNCTION
    this.reloadService.refreshCart$.subscribe((res) => {
      this.getCartsItems(res);
      // this.cd.markForCheck();
    });
    this.getCartsItems();

    // WISH LIST FUNCTION
    this.reloadService.refreshWishList$.subscribe(() => {
      this.getWishListsItems();
      // this.cd.markForCheck();
    });
    this.getWishListsItems();

    // COMPARE
    this.reloadService.refreshCompareList$.subscribe(() => {
      this.getCompareList();
    });
    this.getCompareList();
  }

  ngAfterViewInit(): void {
    this.searchAnim();
    const formValue = this.searchForm.valueChanges;

    this.subForm = formValue
      .pipe(
        // map(t => t.searchTerm)
        // filter(() => this.searchForm.valid),
        pluck('searchTerm'),
        debounceTime(150),
        distinctUntilChanged(),
        switchMap((data) => {
          this.searchQuery = data.trim();
          if (this.searchQuery === '' || this.searchQuery === null) {
            this.overlay = false;
            this.searchProducts = [];
            this.searchQuery = null;
            return EMPTY;
          }
          this.isLoading = true;
          const pagination: Pagination = {
            pageSize: 12,
            currentPage: 0,
          };
          // Select
          const mSelect = {
            name: 1,
            slug: 1,
            images: 1,
            category: 1,
            subCategory: 1,
            discountType: 1,
            discountAmount: 1,
            brand: 1,
            costPrice: 1,
            salePrice: 1,
            hasVariations: 1,
            status: 1,
          };

          const filterData: FilterData = {
            pagination: pagination,
            filter: null,
            select: mSelect,
            sort: { createdAt: -1 },
          };
          return this.productService.getAllProducts(
            filterData,
            this.searchQuery
          );
        })
      )
      .subscribe(
        (res) => {
          this.isLoading = false;
          this.searchProducts = res.data;
          if (this.searchProducts.length > 0) {
            this.isOpen = true;
            this.overlay = true;
          }
        },
        (error) => {
          this.isLoading = false;
          console.log(error);
        }
      );
  }

  /**
   * ON SEARCH CHANGE
   * onChangeInput()
   */
  onChangeInput(event: string) {
    const data = event ? event.trim() : null;
    if (data) {
      this.router.navigate(['/products'], {
        queryParams: { search: data },
        queryParamsHandling: 'merge',
      });
    } else {
      this.router.navigate(['/products'], {
        queryParams: { search: null },
        queryParamsHandling: 'merge',
      });
    }
  }

  /**
   * COMPARE ITEM COUNT
   */
  getCompareList() {
    this.compareItemsCount = this.productService.getCompareList().length;
  }

  /**
   * HTTP REQ HANDLE
   * getLoggedInUserData()
   * getCartsItems()
   * updateCartQty()
   * deleteCartById()
   * getWishListsItems()
   */

  private getLoggedInUserData() {
    const select = 'name';
    this.userDataService.getLoggedInUserData(select).subscribe(
      (res) => {
        this.user = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private getCartsItems(refresh?: boolean) {
    if (this.userService.getUserStatus()) {
      this.cartService.getCartByUser().subscribe((res) => {
        this.carts = res.data;
        this.cartService.updateCartList(this.carts);
        if (refresh) {
          this.cartAnimate = true;
          setTimeout(() => {
            if (this.cartAnimate == true) {
              this.cartAnimate = false;
            }
          }, 1000);
        }
      });
    } else {
      this.getCarsItemFromLocal(refresh);
    }
  }

  private updateCartQty(cartId: string, data: any) {
    this.cartService.updateCartQty(cartId, data).subscribe(
      () => {
        this.reloadService.needRefreshCart$();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deleteCartById(cartId: string) {
    this.cartService.deleteCartById(cartId).subscribe(
      () => {
        this.reloadService.needRefreshCart$();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private getCarsItemFromLocal(refresh?: boolean) {
    const items = this.cartService.getCartItemFromLocalStorage();
    if (items && items.length > 0) {
      const ids: string[] = items.map((m) => m.product as string);
      const select =
        'name description salePrice sku discountType discountAmount images quantity category subCategory brand tags';
      this.productService.getProductByIds(ids, select).subscribe((res) => {
        const products = res.data;
        if (products && products.length > 0) {
          this.carts = items.map((t1) => ({
            ...t1,
            ...{ product: products.find((t2) => t2._id === t1.product) },
          }));
          this.cartService.updateCartList(this.carts);
          if (refresh) {
            this.cartAnimate = true;
            setTimeout(() => {
              if (this.cartAnimate == true) {
                this.cartAnimate = false;
              }
            }, 1000);
          }
        }
      });
    } else {
      this.carts = [];
      this.cartService.updateCartList(this.carts);
    }
  }

  private getWishListsItems() {
    if (this.userService.getUserStatus()) {
      this.wishListService.getWishListByUser().subscribe(
        (res) => {
          this.wishLists = res.data;
          this.wishListService.updateWishList(this.wishLists);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  /**
   * LOGICAL METHODS
   * onIncrementQty()
   * onDecrementQty()
   * onDeleteCartItem()
   */

  onIncrementQty(cartId: string, index: number) {
    if (this.userService.getUserStatus()) {
      this.updateCartQty(cartId, { selectedQty: 1, type: 'increment' });
    } else {
      const data = this.cartService.getCartItemFromLocalStorage();
      if (data != null) {
        data[index].selectedQty = data[index].selectedQty + 1;
        localStorage.setItem(DATABASE_KEY.userCart, JSON.stringify(data));
        this.reloadService.needRefreshCart$();
      }
    }
  }

  onDecrementQty(cartId: string, index: number, sQty: number) {
    if (this.userService.getUserStatus()) {
      if (sQty === 1) {
        this.uiService.warn('Minimum quantity is 1');
        return;
      }
      this.updateCartQty(cartId, { selectedQty: 1, type: 'decrement' });
    } else {
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
  }

  onDeleteCartItem(cartId: string, productId?: string) {
    if (this.userService.getUserStatus()) {
      this.deleteCartById(cartId);
    } else {
      this.cartService.deleteCartItemFromLocalStorage(productId);
      this.reloadService.needRefreshCart$();
    }
  }

  /**
   * Calculation
   * cartSubTotal()
   */

  get cartSubTotal(): number {
    return this.carts
      .map((t) => {
        return this.pricePipe.transform(
          t.product as Product,
          'salePrice',
          t.selectedQty
        ) as number;
      })
      .reduce((acc, value) => acc + value, 0);
  }

  /**
   * Close Header TopBar
   */
  closeHeaderTop() {
    this.headerTop = false;
  }

  /***
   * Responsive search bar toggle
   */
  resSearchBoxToggle() {
    this.resSearchShow = !this.resSearchShow;
  }

  /***
   * header Fixed;
   */
  @HostListener('window:scroll')
  scrollBody() {
    this.headerFixed = window.scrollY > 400;
  }

  /***
   * Scroll Top To Start
   */
  // scrollTopToStart() {
  //   this.router.events.subscribe((e) => {
  //     if (!(e instanceof NavigationEnd)) {
  //       return;
  //     }
  //     window.scrollBy(0, 0);
  //   })

  // }

  /**
   *  cartSlideShow()
   *  cartSlideHide()
   */
  cartSlideShow() {
    this.cartSlide = true;
    this.categorySlide.onHideCategory();
  }

  public onSubmit() {
    console.log('On submit');
  }

  public clickProceedToCart() {
    this.cartSlide = false;
    if(this.carts.length) {
      if (this.isUserAuth) {
        this.router.navigate(['/checkout']);
      } else {
        this.router.navigate(['/login'], {
          queryParams: { redirectTo: 'checkout' },
        });
      }
    } else {
      this.uiService.warn('Sorry! No product to your cart.')
    }

  }
  cartSlideHide() {
    this.cartSlide = false;
  }

  categoryBarControll() {
    //Navigate controll
    this.router.events.subscribe(() => {
      if (this.router.url == '/') {
        this.categoryBar = false;
      } else {
        this.categoryBar = true;
      }
    });
    //Initial Load Controll
    if (this.router.url == '/') {
      this.categoryBar = true;
    } else {
      this.categoryBar = true;
    }
  }

  showCategory() {
    this.categorySlide.onShowCategory();
  }

  /**
   * HANDLE SEARCH Area
   * onClickHeader()
   * onClickSearchArea()
   * handleOverlay()
   * handleFocus()
   * setPanelState()
   * handleOpen()
   * handleOutsideClick()
   * handleCloseOnly()
   * handleCloseAndClear()
   * onSelectItem()
   */

  onClickHeader(): void {
    this.searchInput.nativeElement.value = '';
    this.handleCloseOnly();
  }

  onClickSearchArea(event: MouseEvent): void {
    event.stopPropagation();
  }

  handleOverlay(): void {
    this.overlay = false;
    this.isOpen = false;
    this.isFocused = false;
  }

  handleFocus(event: FocusEvent): void {
    this.searchInput.nativeElement.focus();

    if (this.isFocused) {
      return;
    }
    if (this.searchProducts.length > 0) {
      this.setPanelState(event);
    }
    this.isFocused = true;
  }

  private setPanelState(event: FocusEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.isOpen = false;
    this.handleOpen();
  }

  handleOpen(): void {
    if (this.isOpen || (this.isOpen && !this.isLoading)) {
      return;
    }
    if (this.searchProducts.length > 0) {
      this.isOpen = true;
      this.overlay = true;
    }
  }

  handleOutsideClick(): void {
    this.searchInput.nativeElement.value = '';
    if (!this.isOpen) {
      // this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.isFocused = false;
  }

  handleCloseOnly(): void {
    if (!this.isOpen) {
      this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.isFocused = false;
  }

  handleCloseAndClear(): void {
    if (!this.isOpen) {
      this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.searchProducts = [];
    this.isFocused = false;
  }

  onSelectItem(data: Product): void {
    this.searchInput.nativeElement.value = '';
    this.handleCloseAndClear();
    this.router.navigate(['/products/details', data?.slug]);
  }

  /**
   * SEARCH PLACEHOLDER ANIMATION
   */
  private searchAnim() {
    const target = this.searchInput.nativeElement as HTMLInputElement;
    const target2 = this.searchInputMobile
      ? (this.searchInputMobile.nativeElement as HTMLInputElement)
      : null;
    target.placeholder = '|';
    this.typeIt(target);
    if (target2) {
      target2.placeholder = '|';
      this.typeIt(target2);
    }
  }

  private typeIt(target: HTMLInputElement) {
    const humanize = Math.round(Math.random() * (300 - 30)) + 30;
    this.timeOutOngoing = setTimeout(() => {
      this.char++;
      const type = this.txt.substring(0, this.char);
      target.placeholder = type + '|';
      this.typeIt(target);
      if (this.char === this.txt.length) {
        // target.placeholder = txt.slice(0, -1);
        target.placeholder = '|';
        this.char = 0;
        // clearTimeout(timeOut);
      }
    }, humanize);
  }

  /**
   * Destroy Huck
   */
  ngOnDestroy(): void {
    if (this.headerHideRoute) {
      this.headerHideRoute.unsubscribe();
    }
  }
}
