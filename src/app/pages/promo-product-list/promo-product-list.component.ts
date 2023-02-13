import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PromoOffer } from '../../interfaces/common/promo-offer.interface';
import { PromoOfferService } from '../../services/common/promo-offer.service';
import { DATABASE_KEY } from '../../core/utils/global-variable';
import { StorageService } from '../../services/core/storage.service';
import { Product } from '../../interfaces/common/product.interface';

@Component({
  selector: 'app-product-list',
  templateUrl: './promo-product-list.component.html',
  styleUrls: ['./promo-product-list.component.scss'],
})
export class PromoProductListComponent implements OnInit {
  // Store Data
  promoOffer: PromoOffer = null;
  products: Product[] = [];
  selectedViewType: string = 'grid';
  id?: string;
  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 12;
  totalProductsStore = 0;
  // Store Data
  slug?: string;

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subRouteOne: Subscription;

  // Loading
  isLoading = true;

  constructor(
    private router: Router,
    private promoOfferService: PromoOfferService,
    private storageService: StorageService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check View Layouts
    if (this.savedViewLayout) {
      this.selectedViewType = this.savedViewLayout['viewType'];
    }
    // this.getAllPromoOffers();
    // GET ID FORM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.slug = param.get('slug');
      if (this.slug) {
        this.getPromoOfferBySlug(this.slug);
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   * getAllPromoOffers()
   */
  // private getAllPromoOffers() {
  //   this.isLoading = true;
  //   this.subDataOne = this.promoOfferService.getPromoOfferSingle().subscribe(
  //     (res) => {
  //       this.isLoading = false;
  //       this.promoOffer = res.data;
  //       console.log(' this.promoOfferdetatl', this.promoOffer);

  //       if (this.promoOffer && this.promoOffer.products.length) {
  //         this.products = this.promoOffer.products.map((m) => {
  //           return m.product as Product;
  //         });
  //       }
  //     },
  //     (error) => {
  //       this.isLoading = false;
  //       console.log(error);
  //     }
  //   );
  // }

  getPromoOfferBySlug(slug: string) {
    this.isLoading = true;
    this.subDataOne = this.promoOfferService.getPromoOfferBySlug(slug).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.promoOffer = res.data;
        console.log('this.getPromoOffer by slug', this.promoOffer);
        if (this.promoOffer && this.promoOffer.products.length) {
          this.products = this.promoOffer.products.map((m) => {
            return ({...m.product, ...{slug2: this.slug},...{discountType:m.offerDiscountType,
                discountAmount:m.offerDiscountAmount}}) as Product;
          });
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.log(error);
      },
    });
  }

  /**
   * CHANGE LAYOUT
   * changeViewLayout()
   * get savedViewLayout()
   */

  changeViewLayout(viewType: string) {
    this.selectedViewType = viewType;
    this.storageService.storeDataToLocalStorage(
      { viewType: viewType },
      DATABASE_KEY.productLayout
    );
  }

  get savedViewLayout() {
    return this.storageService.getDataFromLocalStorage(
      DATABASE_KEY.productLayout
    );
  }

  /**
   * ON PAGINATION CHANGE
   * onPageChanged()
   */
  onPageChanged(event: number) {
    this.currentPage = event;
  }

  /**
   * ON DESTROY
   */

  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
  }
}
