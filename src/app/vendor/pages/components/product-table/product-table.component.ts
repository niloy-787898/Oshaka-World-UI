import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {ActivatedRoute, Router} from '@angular/router';
import {MatOption, MatOptionSelectionChange} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {debounceTime, distinctUntilChanged, pluck, switchMap} from 'rxjs/operators';
import {NgForm} from '@angular/forms';
import {EMPTY, Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Pagination} from "../../../../interfaces/core/pagination";
import {ProductFilter} from "../../../../services/common/product-filter";
import {ProductService} from "../../../../services/common/product.service";
import {SubCategoryService} from "../../../../services/common/sub-category.service";
import {Product} from "../../../../interfaces/common/product.interface";
import {CategoryService} from "../../../../services/common/category.service";
import {Category} from "../../../../interfaces/common/category.interface";
import {SubCategory} from "../../../../interfaces/common/sub-category.interface";
import {FilterData} from "../../../../interfaces/core/filter-data";


@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss']
})
export class ProductTableComponent implements OnInit, AfterViewInit, OnDestroy {

  // Subscriptions
  private subProduct: Subscription;
  private subCat: Subscription;
  private subSubCat: Subscription;
  private subAcRoute: Subscription;
  private subForm: Subscription;

  // Store Data
  products: Product[] = [];
  private holdPrevData: any[] = [];
  categories: Category[] = [];
  subCategories: SubCategory[] = [];

  // Selected Products
  selectedIds: string[] = [];
  selectedProducts: Product[] = [];

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 2;
  totalProductsStore = 0;

  // SEARCH AREA
  searchProducts: Product[] = [];
  isLoading = false;
  isSelect = false;
  searchQuery = null;
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('searchInput') searchInput: ElementRef;

  // Query
  query: ProductFilter = null;

  // Select View Child
  @ViewChild('matCatSelect') matCatSelect: MatSelect;
  @ViewChild('matSubCatSelect') matSubCatSelect: MatSelect;

  constructor(
    private productService: ProductService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    public dialogRef: MatDialogRef<ProductTableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    // GET PAGE FROM QUERY PARAM
    this.subAcRoute = this.activatedRoute.queryParams.subscribe((qParam : any)=> {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      this.getAllProducts();
    });

    // IF HAS DATA FROM PARENT
    if (this.data) {
      this.selectedIds = this.data;
    }

    // GET
    this.getAllCategory();
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
          filter: null,
          select: mSelect,
          sort: null
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
   * HTTP REQ
   */

  private getAllProducts() {
    this.spinner.show();

    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };
    const filterData: FilterData = {
      pagination: pagination,
      filter: null,
      select: null,
      sort: { createdAt: -1 },
    }

    this.subProduct = this.productService.getAllProducts(filterData, this.searchQuery)
      .subscribe(res => {
        this.products = res.data;
        if (this.products && this.products.length > 0) {
          this.products.forEach((m, i) => {
            const index = this.selectedIds.findIndex(f => f === m._id);
            this.products[i].select = index !== -1;
          });
          this.holdPrevData = res.data;
          this.totalProducts = res.count;
          this.totalProductsStore = res.count;
        }
        this.spinner.hide();

      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  private getAllCategory() {
    this.subCat = this.categoryService.getAllCategory()
      .subscribe(res => {
        this.categories = res.data;
      }, error => {
        console.log(error);
      });
  }

  private getAllSubCategory(categoryId: string) {
    this.subSubCat = this.subCategoryService.getSubCategoryByCategoryId(categoryId)
      .subscribe(res => {
        this.subCategories = res.data;
      }, error => {
        console.log(error);
      });
  }


  /**
   * PAGINATION CHANGE
   */
  public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}});
  }


  /**
   * SELECTION CHANGE
   * FILTER
   */
  onSelectCategory(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      const category = event.source.value as Category;
      this.query = {category: category._id};
      this.getAllSubCategory(category._id);
      if (this.currentPage > 1) {
        this.router.navigate([], {queryParams: {page: 1}});
      } else {
        this.getAllProducts();
      }
    }
  }

  onSelectSubCategory(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      const subCategory = event.source.value as SubCategory;
      this.query = {...this.query, ...{subCategory: subCategory._id}};
      if (this.currentPage > 1) {
        this.router.navigate([], {queryParams: {page: 1}});
      } else {
        this.getAllProducts();
      }
    }
  }

  /**
   * ON REMOVE
   */
  onClearFilter() {
    this.matCatSelect.options.forEach((data: MatOption) => data.deselect());
    this.matSubCatSelect.options.forEach((data: MatOption) => data.deselect());
    this.query = null;
    this.router.navigate([], {queryParams: {page: null}, queryParamsHandling: 'merge'});
    this.getAllProducts();
  }

  onCheckChange(event: any, index: number, id: string) {
    if (event) {
      this.selectedIds.push(id);
    } else {
      const i = this.selectedIds.findIndex(f => f === id);
      this.selectedIds.splice(i, 1);
    }
  }

  /**
   * ON CLOSE DIALOG
   */
  onCloseDialog(passData?: boolean) {
    this.dialogRef.close({selectedIds: passData ? this.selectedIds : null});
    this.router.navigate([], {queryParams: {page: null}, queryParamsHandling: 'merge'});
  }

  /**
   * ON DESTROY
   */
  ngOnDestroy() {

    if (this.subAcRoute) {
      this.subAcRoute.unsubscribe();
    }
    if (this.subProduct) {
      this.subProduct.unsubscribe();
    }
    if (this.subCat) {
      this.subCat.unsubscribe();
    }
    if (this.subSubCat) {
      this.subSubCat.unsubscribe();
    }
    if (this.subForm) {
      this.subForm.unsubscribe();
    }
  }


}
