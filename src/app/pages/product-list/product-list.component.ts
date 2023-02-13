import {Subscription} from 'rxjs';
import {Component, OnInit} from '@angular/core';
import {Product, ProductFilterGroup} from 'src/app/interfaces/common/product.interface';
import {ProductService} from 'src/app/services/common/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ReloadService} from 'src/app/services/core/reload.service';
import {Pagination} from 'src/app/interfaces/core/pagination';
import {FilterData, FilterGroup} from 'src/app/interfaces/core/filter-data';
import {StorageService} from '../../services/core/storage.service';
import {DATABASE_KEY} from '../../core/utils/global-variable';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  // Store Data
  products: Product[] = [];
  holdPrevData: Product[] = [];
  searchQuery: string = null;
  productFilterGroup: ProductFilterGroup;
  selectedViewType: string = 'grid';
  selectedCategories: string[] = [];
  selectedSubCategories: string[] = [];
  selectedBrands: string[] = [];

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 24;
  totalProductsStore = 0;

  // Sort
  sortQuery = {createdAt: -1};
  activeSort: number = null;
  activeFilter1: number = null;
  activeFilter2: number = null;


  // Complex Filter
  categoryFilterArray: any[] = [];
  subCategoryFilterArray: any[] = [];
  brandFilterArray: any[] = [];
  ratingFilterArray: any[] = [];
  priceFilterArray: any[] = [];

  // Price
  lowValue: number = null;
  highValue: number = null;

  // FilterData
  filter: any = null;

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subRouteOne: Subscription;
  private subRouteTwo: Subscription;
  private subForm: Subscription;

  filterSlide = false;

  // Loading
  isLoading = true;

  constructor(
    private productService: ProductService,
    private reloadService: ReloadService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService,
  ) {
  }

  ngOnInit(): void {

    // Check View Layouts
    if (this.savedViewLayout) {
      this.selectedViewType = this.savedViewLayout['viewType'];
    }

    // GET PAGE FROM QUERY PARAM
    this.subRouteTwo = this.activatedRoute.queryParams.subscribe(qParam => {
      // Pagination
      this.paginationFromQueryParam(qParam);

      // Search Query
      this.searchQueryFromQueryParam(qParam);

      // Filter Query
      this.filterQueryFromQueryParam(qParam);

      // Fetch data
      this.getAllProducts();
    });

  }

  /**
   * QUERY BUILDER
   * filterQueryFromQueryParam()
   */
  private paginationFromQueryParam(qParam: any) {
    if (qParam && qParam['page']) {
      this.currentPage = qParam['page'];
    } else {
      this.currentPage = 1;
    }
  }

  private searchQueryFromQueryParam(qParam: any) {
    if (qParam && qParam['search']) {
      this.searchQuery = qParam['search'];
    } else {
      this.searchQuery = null;
    }
  }

  private filterQueryFromQueryParam(qParam: any) {
    if (qParam && !qParam['subCategories'] && qParam && qParam['categories']) {
      if (typeof qParam['categories'] === 'string') {
        this.selectedCategories = [qParam['categories']];
      } else {
        this.selectedCategories = qParam['categories'];
      }
      this.categoryFilterArray = this.selectedCategories.map(m => {
        return {'category.slug': m}
      });
    }

    if (qParam && qParam['subCategories']) {
      if (typeof qParam['subCategories'] === 'string') {
        this.selectedSubCategories = [qParam['subCategories']];
      } else {
        this.selectedSubCategories = qParam['subCategories'];
      }
      this.subCategoryFilterArray = this.selectedSubCategories.map(m => {
        return {'subCategory.slug': m}
      });
    }

    if (qParam && qParam['brand']) {
      if (typeof qParam['brand'] === 'string') {
        this.selectedBrands = [qParam['brand']];
      } else {
        this.selectedBrands = qParam['brand'];
      }
      this.brandFilterArray = this.selectedBrands.map(m => {
        return {'brand.slug': m}
      });
    }
  }

  /***
   * controllFilterSlide
   */
  filterSlideToggle() {
    this.filterSlide = !this.filterSlide;
  }


  /**
   * PAGINATION CHANGE
   */
  public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}});
  }

  /**
   * SORTING
   */
  sortData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    this.getAllProducts();
  }

  /**
   * Page Size Change
   */
  onChangePageSize(event: any) {
    this.getAllProducts();
  }

  /**
   * FILTERING
   */
  filterData(value: any, index: number, type: string) {
    switch (type) {
      case 'category': {
        this.filter = {...this.filter, ...{'category._id': value}};
        this.activeFilter1 = index;
        break;
      }
      case 'brand': {
        this.filter = {...this.filter, ...{'brand._id': value}};
        this.activeFilter2 = index;
        break;
      }
      default: {
        break;
      }
    }
    // Re fetch Data
    if (this.currentPage > 1) {
      this.router.navigate([], {queryParams: {page: 1}});
    } else {
      this.getAllProducts();
    }
  }

  /**
   * HTTP REQ HANDLE
   * getAllProducts()
   * getAllCategories()
   * getAllBrands()
   */

  private getAllProducts() {
    const pagination: Pagination = {
      pageSize: Number(this.productsPerPage),
      currentPage: Number(this.currentPage) - 1
    };

    // FilterData
    // const mQuery = this.filter.length > 0 ? {$and: this.filter} : null;

    // Select
    const mSelect = {
      name: 1,
      slug: 1,
      images: 1,
      category: 1,
      subCategory: 1,
      brand: 1,
      costPrice: 1,
      salePrice: 1,
      discountType: 1,
      discountAmount:1,
      hasVariations: 1,
      status: 1,
      videoUrl: 1,
    }

    const mGroup: FilterGroup = {
      isGroup: true,
      category: true,
      subCategory: true,
      brand: true,
    }

    // Compleax Filter Array Based on Selections
    const comFilter: any[] = [];
    if (this.categoryFilterArray.length) {
      comFilter.push(
        {$or: this.categoryFilterArray}
      );
    }

    if (this.subCategoryFilterArray.length) {
      comFilter.push(
        {$or: this.subCategoryFilterArray}
      );
    }

    if (this.brandFilterArray.length) {
      comFilter.push(
        {$or: this.brandFilterArray}
      );
    }

    if (this.ratingFilterArray.length) {
      comFilter.push(
        {$or: this.ratingFilterArray}
      );
    }

    if (this.priceFilterArray.length) {
      comFilter.push(
        {$or: this.priceFilterArray}
      );
    }

    // console.log('comFilter', comFilter);
    let mFilter;
    if (comFilter.length) {
      mFilter = {
        ...this.filter,
        ...{
          $or: comFilter
        }
      }
    } else {
      mFilter = this.filter;
    }

    // console.log('mFilter', mFilter);

    const filterData: FilterData = {
      pagination: pagination,
      filter: mFilter,
      filterGroup: mGroup,
      select: mSelect,
      sort: this.sortQuery
    }


    this.subDataOne = this.productService.getAllProducts(filterData, this.searchQuery)
      .subscribe(res => {
        this.isLoading = false;
        this.products = res.data;
        this.totalProducts = res.count;
        if (!this.productFilterGroup) {
          this.productFilterGroup = res.filterGroup;
        }
        if (this.productFilterGroup) {
          if (this.selectedCategories.length) {
            this.checkCategoryFilter();
          }
          if (this.selectedSubCategories.length) {
            this.checkSubCategoryFilter();
          }
          if (this.selectedBrands.length) {
            this.checkBrandFilter();
          }
        }

      }, error => {
        this.isLoading = false;
        console.log(error);
      });
  }


  /**
   * CHANGE LAYOUT
   * changeViewLayout()
   * get savedViewLayout()
   */

  changeViewLayout(viewType: string) {
    this.selectedViewType = viewType;
    this.storageService.storeDataToLocalStorage({viewType: viewType}, DATABASE_KEY.productLayout)
  }

  get savedViewLayout() {
    return this.storageService.getDataFromLocalStorage(DATABASE_KEY.productLayout);
  }

  /**
   * COMPLEX FILTER METHODS
   * onCheckChange()
   * onPriceRangeChange()
   */
  onCheckChange(event: MatCheckboxChange, type: string, index: number) {
    switch (type) {
      case 'category': {
        const data = this.productFilterGroup.categories[index];
        if (event.checked) {
          this.categoryFilterArray.push({'category.slug': data.slug});
        } else {
          const fIndex = this.categoryFilterArray.findIndex(f => f['category.slug'] === data.slug);
          this.categoryFilterArray.splice(fIndex, 1);
        }
        // Create Query Params
        const categories = this.categoryFilterArray.map(m => m['category.slug']);
        this.router.navigate(
          ['/products'],
          {queryParams: {categories: categories}, queryParamsHandling: 'merge'}
        );

        break;
      }
      case 'subCategory': {
        const data = this.productFilterGroup.subCategories[index];
        if (event.checked) {
          this.subCategoryFilterArray.push({'subCategory.slug': data.slug})
        } else {
          const fIndex = this.subCategoryFilterArray.findIndex(f => f['subCategory.slug'] === data.slug);
          this.subCategoryFilterArray.splice(fIndex, 1);
        }
        // Create Query Params
        const subCategories = this.subCategoryFilterArray.map(m => m['subCategory.slug']);
        this.router.navigate(
          ['/products'],
          {queryParams: {subCategories: subCategories}, queryParamsHandling: 'merge'}
        );
        break;
      }
      case 'brand': {
        const data = this.productFilterGroup.brands[index];
        if (event.checked) {
          this.brandFilterArray.push({'brand.slug': data.slug})
        } else {
          const fIndex = this.brandFilterArray.findIndex(f => f['brand.slug'] === data.slug);
          this.brandFilterArray.splice(fIndex, 1);
        }
        // Create Query Params
        const brands = this.brandFilterArray.map(m => m['brand.slug']);
        this.router.navigate(
          ['/products'],
          {queryParams: {brands: brands}, queryParamsHandling: 'merge'}
        );
        break;
      }
      case 'rating': {
        // const data = this.fuelTypesData[index];
        // if (event.checked) {
        //   this.fuelTypesFilterArray.push({fuelTypes: data.value})
        // } else {
        //   const fIndex = this.fuelTypesFilterArray.findIndex(f => f.fuelTypes === data.value);
        //   this.fuelTypesFilterArray.splice(fIndex, 1);
        // }
        break;
      }
      default: {
        break;
      }
    }

  }

  onPriceRangeChange() {
    const range = {salePrice: {$gt: this.lowValue, $lt: this.highValue}};
    this.priceFilterArray = [range];
    this.getAllProducts();
  }

  /**
   * CHECK BOX CHECKER
   * checkCategoryFilter()
   * checkSubCategoryFilter()
   * checkBrandFilter()
   */
  checkCategoryFilter() {
    this.productFilterGroup.categories.forEach((cat, i) => {
      const fIndex = this.selectedCategories.findIndex(f => f === cat.slug);
      if (fIndex !== -1) {
        this.productFilterGroup.categories[i].select = true;
      }
    });
  }

  checkSubCategoryFilter() {
    this.productFilterGroup.subCategories.forEach((cat, i) => {
      const fIndex = this.selectedSubCategories.findIndex(f => f === cat.slug);
      if (fIndex !== -1) {
        this.productFilterGroup.subCategories[i].select = true;
      }
    });
  }

  checkBrandFilter() {
    this.productFilterGroup.brands.forEach((cat, i) => {
      const fIndex = this.selectedBrands.findIndex(f => f === cat.slug);
      if (fIndex !== -1) {
        this.productFilterGroup.brands[i].select = true;
      }
    });
  }

  /**
   * RESET FILTER
   * resetCategoryFilter()
   * resetSubCategoryFilter()
   * resetBrandFilter()
   */

  resetCategoryFilter() {
    this.selectedCategories = [];
    this.categoryFilterArray = [];
    this.productFilterGroup.categories.forEach((cat, i) => {
      this.productFilterGroup.categories[i].select = false;
    });
    this.router.navigate(
      ['/products'],
      {queryParams: {categories: []}, queryParamsHandling: 'merge'}
    );
  }

  resetSubCategoryFilter() {
    this.selectedSubCategories = [];
    this.subCategoryFilterArray = [];
    this.productFilterGroup.subCategories.forEach((cat, i) => {
      this.productFilterGroup.subCategories[i].select = false;
    });
    this.router.navigate(
      ['/products'],
      {queryParams: {subCategories: []}, queryParamsHandling: 'merge'}
    );
  }

  resetBrandFilter() {
    this.selectedBrands = [];
    this.brandFilterArray = [];
    this.productFilterGroup.brands.forEach((cat, i) => {
      this.productFilterGroup.brands[i].select = false;
    });
    this.router.navigate(
      ['/products'],
      {queryParams: {brands: []}, queryParamsHandling: 'merge'}
    );
  }

  /**
   * NAVIGATE
   */
  onNavigateAllProducts() {
    this.filter = null;

    this.selectedCategories = [];
    this.categoryFilterArray = [];
    this.productFilterGroup.categories.forEach((cat, i) => {
      this.productFilterGroup.categories[i].select = false;
    });

    this.selectedSubCategories = [];
    this.subCategoryFilterArray = [];
    this.productFilterGroup.subCategories.forEach((cat, i) => {
      this.productFilterGroup.subCategories[i].select = false;
    });

    this.selectedBrands = [];
    this.brandFilterArray = [];
    this.productFilterGroup.brands.forEach((cat, i) => {
      this.productFilterGroup.brands[i].select = false;
    });
    this.router.navigate(
      ['/products']
    );
  }

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
    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }

    if (this.subRouteTwo) {
      this.subRouteTwo.unsubscribe();
    }
  }




}

