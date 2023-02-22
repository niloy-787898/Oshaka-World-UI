import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {Subscription} from 'rxjs';
import {ProductService} from 'src/app/services/common/product.service';
import {Product} from 'src/app/interfaces/common/product.interface';
import {FormGroup, NgForm} from '@angular/forms';
import {SubCategory} from 'src/app/interfaces/common/sub-category.interface';
import {Cart} from '../../interfaces/common/cart.interface';
import {UserService} from '../../services/common/user.service';
import {ReloadService} from '../../services/core/reload.service';
import {CartService} from '../../services/common/cart.service';
import {UiService} from '../../services/core/ui.service';
import {DATABASE_KEY} from '../../core/utils/global-variable';
import {WishListService} from '../../services/common/wish-list.service';
import {WishList} from '../../interfaces/common/wish-list.interface';
import {Pagination} from '../../interfaces/core/pagination';
import {FilterData} from '../../interfaces/core/filter-data';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Review} from '../../interfaces/common/review.interface';
import {ReviewService} from '../../services/common/review.service';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  //store data
  step = 1;
  slug?: string;
  product?: Product;
  description?: any;
  relatedProducts: Product[] = [];
  subCategories: SubCategory[] = [];
  carts: Cart[] = [];
  cart: Cart = null;
  wishlists: WishList[] = [];
  wishlist: WishList = null;
  safeURL: SafeResourceUrl;
  allReviews: Review[] = [];

  navUrl: string;

  // Image Zoom & View Area
  @ViewChild('zoomViewer', {static: true}) zoomViewer;
  image: string;
  zoomImage: string;

  // Loading Control
  isLoadingRelatedProducts: boolean = false;

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 5;
  totalProductsStore = 0;

  isUserAuth: boolean = false;

  // Subscription
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;
  private subDataFive: Subscription;
  private subDataSix: Subscription;
  private subReloadOne: Subscription;
  private subReloadTwo: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private spinnerService: NgxSpinnerService,
    private productService: ProductService,
    private userService: UserService,
    private reloadService: ReloadService,
    private cartService: CartService,
    private uiService: UiService,
    private wishListService: WishListService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private reviewService: ReviewService,
  ) {
  }


  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((param) => {
      this.slug = param.get('slug');

      if (this.slug) {
        this.getProductById();
        this.getProductBySlugOnlyDescription();
      }
    });

    // CART FUNCTION STORED
    this.subReloadOne = this.cartService.refreshStoredCart$.subscribe(() => {
      this.carts = this.cartService.cartItems;
      this.checkCartList();
    });

    // WiSHLIST FUNCTION STORED
    this.subReloadTwo = this.wishListService.refreshStoredWishList$.subscribe(() => {
      this.wishlists = this.wishListService.wishListItems;
      this.checkWishList();
    });


    // Normal user status
    this.isUserAuth = this.userService.getUserStatus();
  }


  /**
   * Button Click Event Handle
   * onAddToCart()
   * onAddToWishList()
   * onAddToWishList()
   */

  onAddToCart(event: MouseEvent) {
    event.stopPropagation();
    if (this.cart) {
      if (this.isUserAuth) {
        this.router.navigate(['/cart'])
      } else {
        this.router.navigate(['/login'], {queryParams: {navigateFrom: '/cart'}, queryParamsHandling: 'merge'})
      }
    } else {

      const data: Cart = {
        product: this.product?._id,
        selectedQty: 1,
      };
      if (this.userService.getUserStatus()) {
        this.addToCartDB(data, '/checkout');
      } else {
        this.cartService.addCartItemToLocalStorage(data);
        this.reloadService.needRefreshCart$(true);
      }
    }
  }


  onAddToCartAndRedirect(event: MouseEvent) {
    event.stopPropagation();
    const data: Cart = {
      product: this.product?._id,
      selectedQty: 1,
    };
    if (this.userService.getUserStatus()) {
      if (this.cart) {
        this.onIncrementQty(null, '/checkout')
      } else {
        this.addToCartDB(data, '/checkout');
      }


    } else {
      this.cartService.addCartItemToLocalStorage(data);
      this.reloadService.needRefreshCart$(true);
      this.router.navigate(['/login'], {queryParams: {redirectTo: 'checkout'}});
    }
  }

  onAddToWishList(event: MouseEvent) {
    event.stopPropagation();
    if (this.wishlist) {
      this.removeWishlistById(this.wishlist?._id);
    } else {
      const data: WishList = {
        product: this.product?._id,
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
   * getAllReviews()
   */


  addToCartDB(data: Cart, url?: string) {
    console.log('url', url)
    this.subDataOne = this.cartService.addToCart(data)
      .subscribe(res => {
        // console.log(res);
        this.uiService.success(res.message);
        this.reloadService.needRefreshCart$(true);

        if (url) {
          this.router.navigate(['/checkout'])
        }
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

  private getProductById() {
    this.spinnerService.show();
    // const select = 'name email username phoneNo gender role permissions hasAccess'
    this.subDataFive = this.productService.getProductBySlug(this.slug)
      .subscribe(res => {
        this.spinnerService.hide();
        if (res.success) {
          this.product = res.data;
          console.log('this.product', this.product)
          if (this.product?.videoUrl) {
            this.safeURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.product?.videoUrl);
          }
          this.carts = this.cartService.cartItems;
          this.checkCartList();
          this.wishlists = this.wishListService.wishListItems;
          this.checkWishList();
          this.setDefaultImage();
          // Related Products
          this.getRelatedProducts();
          this.getAllReviews();
        }
      }, error => {
        this.spinnerService.hide();
        console.log(error);
      });
  }


  private getProductBySlugOnlyDescription() {
    console.log('_____________');
    this.spinnerService.show();
    // const select = 'name email username phoneNo gender role permissions hasAccess'
    this.subDataFive = this.productService.getProductBySlugOnlyDescription(this.slug)
      .subscribe(res => {
        this.spinnerService.hide();
        if (res.success) {
          this.description = res.data?.description;

          console.log('res.data', res.data);
        }
      }, error => {
        this.spinnerService.hide();
        console.log(error);
      });
  }

  private getRelatedProducts() {
    this.isLoadingRelatedProducts = true;
    const pagination: Pagination = {
      pageSize: 6,
      currentPage: 0
    };

    const mSelect = {
      name: 1,
      slug: 1,
      images: 1,
      category: 1,
      subCategory: 1,
      brand: 1,
      costPrice: 1,
      salePrice: 1,
      hasVariations: 1,
      status: 1,
      tags: 1,
      videoUrl: 1,
    }

    const filterData: FilterData = {
      pagination: pagination,
      filter: {
        'category._id': this.product?.category?._id,
        'subCategory._id': this.product?.subCategory?._id
      },
      select: mSelect,
      sort: {createdAt: 1}
    }

    this.subDataSix = this.productService.getAllProducts(filterData, null)
      .subscribe(res => {
        if (res.data && res.data.length) {
          this.relatedProducts = res.data.filter(f => f._id !== this.product?._id);
        }

        this.isLoadingRelatedProducts = false;
      }, error => {
        this.isLoadingRelatedProducts = false;
        console.log(error);
      });
  }

  private getAllReviews() {
    const pagination: Pagination = {
      pageSize: Number(this.productsPerPage),
      currentPage: Number(this.currentPage) - 1
    };

    // Select
    const mSelect = {
      name: 1,
      user: 1,
      product: 1,
      review: 1,
      rating: 1,
      status: 1,
      reviewDate: 1,
      reply: 1,
      replyDate: 1,
    }

    const filterData: FilterData = {
      pagination: pagination,
      filter: {'product._id': this.product._id, status: true},
      select: mSelect,
      sort: {createdAt: -1}
    }

    this.subDataFour = this.reviewService.getAllReviewsByQuery(filterData, null)
      .subscribe(res => {
        this.allReviews = res.data;
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

  onIncrementQty(event?: MouseEvent, url?: string) {
    if (event) {
      event.stopPropagation();
    }
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

    if (url) {
      console.log("0000000000")
      this.router.navigate(['/checkout'])
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
    this.cart = this.carts.find(f => (f.product as Product)._id === this.product?._id);
  }

  checkWishList() {
    this.wishlist = this.wishlists.find(f => (f.product as Product)._id === this.product?._id);
  }


  /**
   * IMAGE ZOOM & VIEW AREA & OTHER CONTROL
   * setDefaultImage()
   * selectImage()
   * onMouseMove()
   * onMouseLeave()
   * stepControl()
   */
  private setDefaultImage() {
    this.image = this.product.images && this.product.images.length > 0 ? this.product.images[0] : '/assets/images/placeholder/test.png';
    this.zoomImage = this.image;
  }

  public selectImage(data: any) {
    this.image = data;
    this.zoomImage = data;
  }

  public onMouseMove(e) {
    if (window.innerWidth >= 1099) {
      const image = e.currentTarget;
      const offsetX = e.offsetX;
      const offsetY = e.offsetY;
      const x = offsetX / image.offsetWidth * 110;
      const y = offsetY / image.offsetHeight * 110;
      const zoom = this.zoomViewer.nativeElement.children[0];
      if (zoom) {
        zoom.style.backgroundPosition = x + '% ' + y + '%';
        zoom.style.display = 'block';
        zoom.style.height = `${image.height}px`;
        zoom.style.width = `${image.width + 30}px`;
      }
    }
  }

  public onMouseLeave(event) {
    this.zoomViewer.nativeElement.children[0].style.display = 'none';
  }

  stepControl(number: any) {
    this.step = number;
  }

  /**
   * CLICK FUNCTIONS
   * createNavigationUrl()
   */
  public createNavigationUrl(type: string) {
    let searchParams = new URLSearchParams();

    switch (type) {
      case 'facebook':
        searchParams.set('u', 'https://osaka.co/products/details/' + this.product._id);
        this.navUrl = 'https://www.facebook.com/sharer/sharer.php?' + searchParams;
        break;

      case 'twitter':
        searchParams.set('url', 'https://osaka.co/products/details/' + this.product._id);
        this.navUrl = 'https://twitter.com/share?' + searchParams;
        break;

      case 'whatsapp':
        searchParams.set('text', 'https://osaka.co/products/details/' + this.product._id);
        this.navUrl = 'https://web.whatsapp.com/send?' + searchParams;
        break;

      case 'linkedin':
        searchParams.set('url', 'https://osaka.co/products/details/' + this.product._id);
        this.navUrl = 'https://www.linkedin.com/sharing/share-offsite/?' + searchParams;
        break;
    }
    return window.open(this.navUrl, '_blank');

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
    if (this.subDataFive) {
      this.subDataFive.unsubscribe();
    }
    if (this.subDataSix) {
      this.subDataSix.unsubscribe();
    }
    if (this.subReloadOne) {
      this.subReloadOne.unsubscribe();
    }
    if (this.subReloadTwo) {
      this.subReloadTwo.unsubscribe();
    }
  }

}
