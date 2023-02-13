import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  PLATFORM_ID,
  Inject, OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PageEvent } from '@angular/material/paginator';
import { NgForm } from '@angular/forms';
import {EMPTY, Subscription} from 'rxjs';
import {
  pluck,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import {PcBuildService} from '../../../services/common/pc-build.service';
import {ProductService} from '../../../services/common/product.service';
import {Product} from '../../../interfaces/common/product.interface';
import {FilterData} from '../../../interfaces/core/filter-data';
import {ReloadService} from '../../../services/core/reload.service';
import {Pagination} from '../../../interfaces/core/pagination';

@Component({
  selector: 'app-choose-product',
  templateUrl: './choose-product.component.html',
  styleUrls: ['./choose-product.component.scss'],
  // providers:[
  //   ProductImagePipe
  // ]
})
export class ChooseProductComponent implements OnInit, OnDestroy {
  componentId: string = null;
  componentTag: string = null;
  componentSlug: string = null;

  //Store Data
  products: Product[] = []
  holdPrevData: Product[] = []

  // Filter QUERY
  private query: any;

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 10;
  totalProductsStore = 0;

  // SEARCH AREA
  searchProducts: Product[] = [];
  searchQuery = null;
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('searchInput') searchInput: ElementRef;

  //Subscription
  private subReload: Subscription
  private subRouteOne: Subscription
  private subDataOne: Subscription
  private subForm: Subscription

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private pcBuildService: PcBuildService,
    private productService: ProductService,
    private spinner: NgxSpinnerService,
    private reloadService: ReloadService,
    @Inject(PLATFORM_ID) public platformId: any
  ) {}

  ngOnInit() {this.activatedRoute.paramMap.subscribe((param) => {
    console.log(param);
    this.componentId = param.get('id');
    this.componentTag = param.get('componentTag');
    this.componentSlug = param.get('componentCatSlug');
    if (this.componentTag === this.componentSlug) {
      this.query = {
        $or: [
          { categorySlug: this.componentTag },
          { subCatSlug: this.componentSlug },
        ],
      };
      console.log('if query', this.query)
    } else if (this.componentSlug === 'ram') {
      (this.query = { categorySlug: this.componentTag }),
        { subCatSlug: 'ram-(desktop)' };
      console.log('else if query', this.query)
    } else {
      this.query = {
        categorySlug: this.componentTag,
        subCatSlug: this.componentSlug,
      };
      console.log('else query', this.query)
    }
    //  this.query = {categorySlug: this.componentTag, subCatSlug: this.componentSlug};

  });

    this.subReload = this.reloadService.refreshData$
      .subscribe(() => {
        this.getAllProducts();
      });

    // GET PAGE FROM QUERY PARAM
    this.subRouteOne = this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam['page']) {
        this.currentPage = qParam['page'];
      } else {
        this.currentPage = 1;
      }
      this.getAllProducts();
    });


  }


  ngAfterViewInit(): void {
    const formValue = this.searchForm.valueChanges;

    this.subForm = formValue.pipe(
      // map(t => t.searchTerm)
      // filter(() => this.searchForm.valid),
      pluck('searchTerm'),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(data => {
        this.searchQuery = data;
        if (this.searchQuery === '' || this.searchQuery === null) {
          this.searchProducts = [];
          this.products = this.holdPrevData;
          this.totalProducts = this.totalProductsStore;
          this.searchQuery = null;
          return EMPTY;
        }
        const pagination: Pagination = {
          pageSize: Number(this.productsPerPage),
          currentPage: Number(this.currentPage) - 1
        };
        // Select
        const mSelect = {
          name: 1,
          slug: 1,
          images: 1,
          category: 1,
          subCategory: 1,
          brand: 1,
          unit: 1,
          costPrice: 1,
          salePrice: 1,
          hasVariations: 1,
          status: 1,
        }

        const filterData: FilterData = {
          pagination: pagination,
          filter: {'category.name': this.query.categorySlug, 'subCategory.name': this.query.subCatSlug},
          select: mSelect,
          sort: {createdAt: -1}
        }
        return this.productService.getAllProducts(filterData, this.searchQuery);
      })
    )
      .subscribe(res => {
        this.searchProducts = res.data;
        this.products = this.searchProducts;
        this.totalProducts = res.count;
        this.currentPage = 1;
        this.router.navigate([], {queryParams: {page: this.currentPage}});
      }, error => {
        console.log(error)
      });
  }

  /**
   * HTTP REQ HANDLE
   *
   */
  private getAllProducts() {
    this.spinner.show();
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
      unit: 1,
      costPrice: 1,
      salePrice: 1,
      hasVariations: 1,
      status: 1,
    }

    const filterData: FilterData = {
      pagination: pagination,
      filter: {'category.name': this.query.categorySlug, 'subCategory.name': this.query.subCatSlug},
      select: mSelect,
      sort: { createdAt: -1 }
    }


    this.subDataOne = this.productService.getAllProducts(filterData, this.searchQuery)
      .subscribe(res => {
        this.spinner.hide();
        this.products = res.data;
        if (this.products && this.products.length) {

          this.totalProducts = res.count;
          if (!this.searchQuery) {
            this.holdPrevData = res.data;
            this.totalProductsStore = res.count;
          }

        }
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }


  onAddToPcBuild(p: Product) {

    console.log('onAddToPcBuild',p);
    const data = {
      name: p.name,
      price: p.salePrice,
      image: p.images[0]
    };
    this.pcBuildService.addProductToBuildTool(this.componentId, data);
    this.router.navigate(['/pc-builder']);
  }


  /**
   * PAGINATION CHANGE
   */
  public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}});
  }

  /**
   * NG ON DESTROY
   */
  ngOnDestroy() {
    if(this.subRouteOne){
      this.subRouteOne.unsubscribe()
    }
    if(this.subForm){
      this.subForm.unsubscribe()
    }
    if(this.subReload){
      this.subReload.unsubscribe()
    }
    if(this.subDataOne){
      this.subDataOne.unsubscribe()
    }

  }

}
