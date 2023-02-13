import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Carousel } from 'src/app/interfaces/common/carousel.interface';
import { FilterData } from 'src/app/interfaces/core/filter-data';
import { CarouselService } from 'src/app/services/common/carousel.service';
import { Category } from '../../interfaces/common/category.interface';
import { CategoryService } from '../../services/common/category.service';
import { Pagination } from '../../interfaces/core/pagination';
import { ProductDetailsService } from '../../services/product-details.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BrandService } from '../../services/common/brand.service';
import { Brand } from '../../interfaces/common/brand.interface';
import { Product } from '../../interfaces/common/product.interface';
import { ProductService } from '../../services/common/product.service';
import { CategoryMenu } from '../../interfaces/common/category-menu.interface';
import { SubCategoryService } from '../../services/common/sub-category.service';
import { PromoOfferService } from '../../services/common/promo-offer.service';
import { PromoOffer } from '../../interfaces/common/promo-offer.interface';
import { Tag } from '../../interfaces/common/tag.interface';
import { TagService } from '../../services/common/tag.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  // Store Data
  carousels: Carousel[] = [];
  categories: Category[] = [];
  brands: Brand[] = [];
  tags: Tag[] = [];
  categoryMenus: CategoryMenu[] = [];
  featureProducts: Product[] = [];
  newProducts: Product[] = [];
  topSalesProducts: Product[] = [];
  topRatingProducts: Product[] = [];
  topDiscountProducts: Product[] = [];
  promoOffer: PromoOffer = null;
  promoOffers: PromoOffer[] = [];
  // For loader
  isLoadingCategoryMenu: boolean = false;
  isLoadingFeaturedProducts: boolean = false;
  isLoadingNewProducts: boolean = false;
  isLoadingTopSalesProducts: boolean = false;
  isLoadingTopRatingProducts: boolean = false;
  isLoadingTopDiscountProducts: boolean = false;
  isLoadingPromoOffer: boolean = false;

  // Static data
  selectedProductType: string = 'topSales';

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;
  private subDataFive: Subscription;
  private subDataSix: Subscription;
  private subDataSeven: Subscription;
  private subDataEight: Subscription;
  private subDataNine: Subscription;
  private subDataEleven: Subscription;
  private subDataTen: Subscription;

  //  private subData: Subscription;

  constructor(
    private productDetails: ProductDetailsService,
    private router: Router,
    private carouselService: CarouselService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private spinner: NgxSpinnerService,
    private brandService: BrandService,
    private productService: ProductService,
    private promoOfferService: PromoOfferService,
    private tagService: TagService
  ) {}

  ngOnInit(): void {
    // Base Data
    this.getAllPromoOffers2();
    this.getSubCategoriesGroupByCategory();
    this.getAllCarousels();
    this.getAllTopSalesProducts();
    this.getAllTopRatingProducts();
    this.getAllTopDiscountProducts();
    this.getAllCategories();
    this.getAllBrands();
    // this.getAllPromoOffers();
    this.getAllTags();

  }

  /**
   * Show and Hide Niche div
   */

  onClickShowNiche(type: string) {
    this.selectedProductType = type;
  }

  /**
   * HTTP REQ HANDLE
   * getAllCarousels()
   * getAllCategories()
   * getAllBrands()
   * getAllTags()
   * getAllCategories()
   * getAllFeaturedProducts()
   * getAllNewProducts()
   * getAllTopSalesProducts()
   * getAllTopRatingProducts()
   * getAllTopDiscountProducts()
   * getAllPromoOffers()
   */
  private getAllCarousels() {
    // Select
    const mSelect = {
      title: 1,
      image: 1,
      url: 1,
      createdAt: 1,
    };

    const filterData: FilterData = {
      pagination: null,
      filter: null,
      select: mSelect,
      sort: { createdAt: -1 },
    };

    this.subDataOne = this.carouselService
      .getAllCarousels(filterData, null)
      .subscribe(
        (res) => {
          this.carousels = res.data;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  private getAllCategories() {
    const pagination: Pagination = {
      pageSize: 11,
      currentPage: 0,
    };

    // Select
    const mSelect = {
      name: 1,
      image: 1,
      slug: 1,
      priority: 1,
    };

    const filterData: FilterData = {
      pagination: pagination,
      filter: null,
      select: mSelect,
      sort: { serial: -1 },
    };

    this.subDataTwo = this.categoryService
      .getAllCategories(filterData, null)
      .subscribe(
        (res) => {
          this.categories = res.data;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  private getAllBrands() {
    this.spinner.show();
    const pagination: Pagination = {
      pageSize: 10,
      currentPage: 0,
    };

    const mSelect = {
      name: 1,
      slug: 1,
      image: 1,
      priority: 1,
      readOnly: 1,
      createdAt: 1,
    };

    const filterData: FilterData = {
      pagination: pagination,
      filter: null,
      select: mSelect,
      sort: { priority: -1 },
    };

    this.subDataThree = this.brandService
      .getAllBrands(filterData, null)
      .subscribe(
        (res) => {
          this.brands = res?.data;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  private getAllFeaturedProducts(tagId: string) {
    this.isLoadingFeaturedProducts = true;
    const pagination: Pagination = {
      pageSize: 6,
      currentPage: 0,
    };

    const mSelect = {
      name: 1,
      slug: 1,
      unit: 1,
      images: 1,
      category: 1,
      subCategory: 1,
      brand: 1,
      costPrice: 1,
      salePrice: 1,
      trackQuantity: 1,
      quantity: 1,
      hasVariations: 1,
      discountType: 1,
      discountAmount: 1,
      status: 1,
      tags: 1,
      videoUrl: 1,
    };

    const filterData: FilterData = {
      pagination: pagination,
      filter: { status: 'publish', tags: tagId },
      select: mSelect,
      sort: { createdAt: -1 },
    };

    this.subDataFour = this.productService
      .getAllProducts(filterData, null)
      .subscribe(
        (res) => {
          this.featureProducts = res.data;
          console.log('featureProducts', this.featureProducts);
          this.isLoadingFeaturedProducts = false;
        },
        (error) => {
          this.isLoadingFeaturedProducts = false;
          console.log(error);
        }
      );
  }

  private getAllTags() {
    // Select
    const mSelect = {
      name: 1,
      slug: 1,
    };

    const filterData: FilterData = {
      pagination: null,
      filter: null,
      select: mSelect,
      sort: null,
    };

    this.subDataEleven = this.tagService
      .getAllTags(filterData, null)
      .subscribe({
        next: (res) => {
          this.tags = res.data;
          if (this.tags && this.tags.length) {
            const featured = this.tags.find((f) => f.name === 'Feature')._id;
            const newP = this.tags.find((f) => f.name === 'New')._id;
            if (featured) {
              this.getAllFeaturedProducts(featured);
            }
            if (newP) {
              this.getAllNewProducts(newP);
            }
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  private getAllNewProducts(tagId: string) {
    this.isLoadingNewProducts = true;
    const pagination: Pagination = {
      pageSize: 6,
      currentPage: 0,
    };

    const mSelect = {
      name: 1,
      slug: 1,
      unit: 1,
      images: 1,
      category: 1,
      subCategory: 1,
      brand: 1,
      costPrice: 1,
      salePrice: 1,
      hasVariations: 1,
      discountType: 1,
      discountAmount: 1,
      status: 1,
      tags: 1,
      videoUrl: 1,
    };

    const filterData: FilterData = {
      pagination: pagination,
      filter: { status: 'publish', tags: tagId },
      select: mSelect,
      sort: { createdAt: -1 },
    };

    this.subDataFive = this.productService
      .getAllProducts(filterData, null)
      .subscribe(
        (res) => {
          this.newProducts = res.data;
          this.isLoadingNewProducts = false;
        },
        (error) => {
          this.isLoadingNewProducts = false;
          console.log(error);
        }
      );
  }

  private getAllTopSalesProducts() {
    this.isLoadingTopSalesProducts = true;
    const pagination: Pagination = {
      pageSize: 5,
      currentPage: 0,
    };

    const mSelect = {
      name: 1,
      slug: 1,
      unit: 1,
      images: 1,
      category: 1,
      subCategory: 1,
      brand: 1,
      costPrice: 1,
      salePrice: 1,
      hasVariations: 1,
      discountType: 1,
      discountAmount: 1,
      status: 1,
      tags: 1,
      videoUrl: 1,
    };

    const filterData: FilterData = {
      pagination: pagination,
      filter: { status: 'publish' },
      select: mSelect,
      sort: { createdAt: -1 },
    };

    this.subDataSix = this.productService
      .getAllProducts(filterData, null)
      .subscribe(
        (res) => {
          this.topSalesProducts = res.data;
          this.isLoadingTopSalesProducts = false;
        },
        (error) => {
          this.isLoadingTopSalesProducts = false;
          console.log(error);
        }
      );
  }

  private getAllTopRatingProducts() {
    this.isLoadingTopRatingProducts = true;
    this.spinner.show();
    const pagination: Pagination = {
      pageSize: 5,
      currentPage: 0,
    };

    const mSelect = {
      name: 1,
      slug: 1,
      unit: 1,
      images: 1,
      category: 1,
      subCategory: 1,
      brand: 1,
      costPrice: 1,
      salePrice: 1,
      hasVariations: 1,
      discountType: 1,
      discountAmount: 1,
      status: 1,
      tags: 1,
      videoUrl: 1,
    };

    const filterData: FilterData = {
      pagination: pagination,
      filter: { status: 'publish' },
      select: mSelect,
      sort: { createdAt: 1 },
    };

    this.subDataSeven = this.productService
      .getAllProducts(filterData, null)
      .subscribe(
        (res) => {
          this.topRatingProducts = res.data;
          this.isLoadingTopRatingProducts = false;
        },
        (error) => {
          this.isLoadingTopRatingProducts = false;
          console.log(error);
        }
      );
  }

  private getAllTopDiscountProducts() {
    this.isLoadingTopDiscountProducts = true;
    const pagination: Pagination = {
      pageSize: 5,
      currentPage: 0,
    };

    const mSelect = {
      name: 1,
      slug: 1,
      unit: 1,
      images: 1,
      category: 1,
      subCategory: 1,
      brand: 1,
      costPrice: 1,
      salePrice: 1,
      hasVariations: 1,
      discountType: 1,
      discountAmount: 1,
      status: 1,
      tags: 1,
      videoUrl: 1,
    };

    const filterData: FilterData = {
      pagination: pagination,
      filter: { status: 'publish' },
      select: mSelect,
      sort: { salePrice: -1 },
    };

    this.subDataEight = this.productService
      .getAllProducts(filterData, null)
      .subscribe(
        (res) => {
          this.topDiscountProducts = res.data;
          this.isLoadingTopDiscountProducts = false;
        },
        (error) => {
          this.isLoadingTopDiscountProducts = false;
          console.log(error);
        }
      );
  }

  private getSubCategoriesGroupByCategory() {
    this.isLoadingCategoryMenu = true;
    this.subDataOne = this.subCategoryService
      .getSubCategoriesGroupByCategory()
      .subscribe(
        (res) => {
          this.isLoadingCategoryMenu = false;
          this.categoryMenus = res.data;
          console.log(
            'this.categoryMenusnyhnynyhhnyhhnhyn ',
            this.categoryMenus
          );
        },
        (error) => {
          this.isLoadingCategoryMenu = false;
          console.log(error);
        }
      );
  }

  private getAllPromoOffers() {
    this.isLoadingPromoOffer = true;
    this.subDataNine = this.promoOfferService.getPromoOfferSingle().subscribe(
      (res) => {
        this.isLoadingPromoOffer = false;
        this.promoOffer = res.data;
        console.log(' this.promoOffer', this.promoOffer);
      },
      (error) => {
        this.isLoadingPromoOffer = false;
        console.log(error);
      }
    );
  }

  private getAllPromoOffers2() {
    this.spinner.show();
    const pagination: Pagination = null;

    const mSelect = {
      title: 1,
      slug: 1,
      description: 1,
      bannerImage: 1,
      startDateTime: 1,
      endDateTime: 1,
      products: 1,
      readOnly: 1,
      createdAt: 1,
    };

    const filterData: FilterData = {
      pagination: pagination,
      filter: null,
      select: mSelect,
      sort: { serial: -1 },
    };

    this.subDataTen = this.promoOfferService
      .getAllPromoOffers(filterData, null)
      .subscribe(
        (res) => {
          this.spinner.hide();
          this.promoOffers = res.data;
          console.log('this.promoOffers', this.promoOffers);
        },
        (error) => {
          this.spinner.hide();
          console.log(error);
        }
      );
  }


  /*** clock calculation */
  days: any;
  hours: any;
  min: any;
  sec: any;
  result: any;

  /*** products area */
  products: any[] = [
    {
      _id: 1,
      image: './assets/images/temp/products/01.jpg',
      name: 'Fresh Green Chilis',
      prvPrice: 34,
      currPrice: 23,
      unit: 'kilo',
    },
    {
      _id: 2,
      image: './assets/images/temp/products/02.jpg',
      name: 'Fresh Green Chilis',
      prvPrice: 34,
      currPrice: 23,
      unit: 'kilo',
    },
    {
      _id: 3,
      image: './assets/images/temp/products/03.jpg',
      name: 'Fresh Green Chilis',
      prvPrice: 34,
      currPrice: 23,
      unit: 'kilo',
    },
    {
      _id: 4,
      image: './assets/images/temp/products/04 (1).jpg',
      name: 'Fresh Green Chilis',
      prvPrice: 34,
      currPrice: 23,
      unit: 'kilo',
    },
    {
      _id: 5,
      image: './assets/images/temp/products/05 (1).jpg',
      name: 'Fresh Green Chilis',
      prvPrice: 34,
      currPrice: 23,
      unit: 'kilo',
    },
    {
      _id: 6,
      image: './assets/images/temp/products/06.jpg',
      name: 'Fresh Green Chilis',
      prvPrice: 34,
      currPrice: 23,
      unit: 'kilo',
    },
    {
      _id: 7,
      image: './assets/images/temp/products/07.jpg',
      name: 'Fresh Green Chilis',
      prvPrice: 34,
      currPrice: 23,
      unit: 'kilo',
    },
    {
      _id: 8,
      image: './assets/images/temp/products/08.jpg',
      name: 'Fresh Green Chilis',
      prvPrice: 34,
      currPrice: 23,
      unit: 'kilo',
    },
  ];

  /****
   * category Data
   */
  /****
   * category Data
   */
  categoryData:any[] =[
    {
      _id:1,
      title:"Groceries",
      bgColor:"#c92127",
      routerLink:'../sub-category',
      image:"./assets/images/temp/image/Grocery.png",

    },
    {
      _id:2,
      title:"Essentials",
      bgColor:"#ab92ed",
      routerLink:'../sub-category',
      image:"./assets/images/temp/image/Essentials.png"
    },
    {
      _id:3,
      title:"Dairy",
      bgColor:"#36c3ee",
      routerLink:'../sub-category',
      image:"./assets/images/temp/image/Dairy.png"
    },
    {
      _id:4,
      title:"Meat",
      bgColor:"#844780",
      routerLink:'../sub-category',
      image:"./assets/images/temp/image/meat.png"
    },
    {
      _id:5,
      title:"Health Care",
      bgColor:"#0bbca0",
      routerLink:'../sub-category',
      image:"./assets/images/temp/image/Health Care.png"
    },
    {
      _id:6,
      title:"Fish",
      bgColor:"#fe7c62",
      routerLink:'../sub-category',
      image:"./assets/images/temp/image/Fish.png"
    },
    {
      _id:7,
      title:"Desserts",
      bgColor:"#ee5a7c",
      routerLink:'../sub-category',
      image:"./assets/images/temp/image/readymix dessert.png"
    },
    {
      _id:8,
      title:"Vegetables",
      bgColor:"#22ab74",
      routerLink:'../sub-category',
      image:"./assets/images/temp/image/vegetable.png"
    },
    {
      _id:9,
      title:"Fruits",
      bgColor:"#dc5f6f",
      routerLink:'../sub-category',
      image:"./assets/images/temp/image/Fruits.png"
    },
    {
      _id:10,
      title:"Shemai",
      bgColor:"#ec5577",
      routerLink:'../sub-category',
      image:"./assets/images/temp/image/Dessert.png"
    },
    {
      _id:11,
      title:"Bakery & Snacks",
      bgColor:"#fbaf51",
      routerLink:'../sub-category',
      image:"./assets/images/temp/image/Bakery & Snacks.png"
    },
    {
      _id:12,
      title:"Household",
      bgColor:"#a1d4a5",
      routerLink:'../sub-category',
      image:"./assets/images/temp/image/Household & Cleaning.png"
    },
    {
      _id:13,
      title:"Groceries",
      bgColor:"#c92127",
      routerLink:'../sub-category',
      image:"./assets/images/temp/image/Grocery.png"
    },
    {
      _id:14,
      title:"Essentials",
      bgColor:"#ab92ed",
      routerLink:'../sub-category',
      image:"./assets/images/temp/image/Essentials.png"
    },
    {
      _id:15,
      title:"Dairy",
      bgColor:"#36c3ee",
      routerLink:'../sub-category',
      image:"./assets/images/temp/image/Dairy.png"
    },
    {
      _id:16,
      title:"Meat",
      bgColor:"#844780",
      routerLink:'../sub-category',
      image:"./assets/images/temp/image/meat.png"
    },
    {
      _id:17,
      title:"Health Care",
      bgColor:"#0bbca0",
      routerLink:'../sub-category',
      image:"./assets/images/temp/image/Health Care.png"
    },
    {
      _id:18,
      title:"Fish",
      bgColor:"#fe7c62",
      routerLink:'../sub-category',
      image:"./assets/images/temp/image/Fish.png"
    },

  ]

  /****
   * category Data
   */

  brandData: any[] = [
    {
      _id: 1,
      title: 'Natural Greeny',
      subTitle: '(45 items)',
      routerLink: '#',
      image: './assets/images/temp/image/07.jpg',
    },
    {
      _id: 2,
      title: 'Vegan Lover',
      subTitle: '(45 Items)',
      routerLink: '#',
      image: './assets/images/temp/image/08.jpg',
    },
    {
      _id: 3,
      title: 'organic foody',
      subTitle: '(35 Items)',
      routerLink: '#',
      image: './assets/images/temp/image/09.jpg',
    },
    {
      _id: 4,
      title: 'Ecomart Limited',
      subTitle: '(27 Items)',
      routerLink: '#',
      image: './assets/images/temp/image/10.jpg',
    },
    {
      _id: 5,
      title: 'Fresh Fortune',
      subTitle: '(34 Items)',
      routerLink: '#',
      image: './assets/images/temp/image/11.jpg',
    },
    {
      _id: 6,
      title: 'Econature',
      subTitle: '(34 Items)',
      routerLink: '#',
      image: './assets/images/temp/image/12.jpg',
    },
  ];

  featureData: any[] = [
    {
      image: './assets/images/temp/products/09.jpg',
      name: 'Fresh Green Chilis',
      prvPrice: 34,
      currPrice: 23,
      unit: 'kilo',
      desc: `Lorem ipsum dolor sit consectetur adipisicing xpedita dicta amet olor ut eveniet commodi...`,
      routerLink: '/products/details',
    },
    {
      image: './assets/images/temp/products/10.jpg',
      name: 'Fresh Green Chilis',
      prvPrice: 34,
      currPrice: 23,
      unit: 'kilo',
      desc: `Lorem ipsum dolor sit consectetur adipisicing xpedita dicta amet olor ut eveniet commodi...`,
      routerLink: '/products/details',
    },
    {
      image: './assets/images/temp/products/11.jpg',
      name: 'Fresh Green Chilis',
      prvPrice: 34,
      currPrice: 23,
      unit: 'kilo',
      desc: `Lorem ipsum dolor sit consectetur adipisicing xpedita dicta amet olor ut eveniet commodi...`,
      routerLink: '/products/details',
    },
    {
      image: './assets/images/temp/products/12.jpg',
      name: 'Fresh Green Chilis',
      prvPrice: 34,
      currPrice: 23,
      unit: 'kilo',
      desc: `Lorem ipsum dolor sit consectetur adipisicing xpedita dicta amet olor ut eveniet commodi...`,
      routerLink: '/products/details',
    },
    {
      image: './assets/images/temp/products/13.jpg',
      name: 'Fresh Green Chilis',
      prvPrice: 34,
      currPrice: 23,
      unit: 'kilo',
      desc: `Lorem ipsum dolor sit consectetur adipisicing xpedita dicta amet olor ut eveniet commodi...`,
      routerLink: '/products/details',
    },
    {
      image: './assets/images/temp/products/14.jpg',
      name: 'Fresh Green Chilis',
      prvPrice: 34,
      currPrice: 23,
      unit: 'kilo',
      desc: `Lorem ipsum dolor sit consectetur adipisicing xpedita dicta amet olor ut eveniet commodi...`,
      routerLink: '/products/details',
    },
  ];

  /**
   * ON DESTROY
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
    if (this.subDataSeven) {
      this.subDataSeven.unsubscribe();
    }
    if (this.subDataEight) {
      this.subDataEight.unsubscribe();
    }
    if (this.subDataNine) {
      this.subDataNine.unsubscribe();
    }
    if (this.subDataTen) {
      this.subDataTen.unsubscribe();
    }

  }




  getShowOrHide(data: PromoOffer) {
    const nowTime = new Date();
    const endTime = new Date(data.endDateTime)
    if(nowTime >= endTime){
      return  {
        'display':'none'
      }
    }else{
      return{
        'display':'block'
      }

    }

  }



}
