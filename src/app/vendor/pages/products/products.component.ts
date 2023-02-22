import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EMPTY, Subscription} from 'rxjs';
import {NgForm} from '@angular/forms';
import {MatSelect} from '@angular/material/select';
import {NgxSpinnerService} from 'ngx-spinner';
import * as XLSX from 'xlsx';
import {debounceTime, distinctUntilChanged, pluck, switchMap} from 'rxjs/operators';
import {MatOption, MatOptionSelectionChange} from '@angular/material/core';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {
  DownloadJsonDialogComponent
} from '../../../shared/dialog-view/download-json-dialog/download-json-dialog.component';
import {Product} from "../../../interfaces/common/product.interface";
import {Vendor} from "../../../interfaces/common/vendor";
import {CategoryService} from "../../../services/common/category.service";
import {SubCategoryService} from "../../../services/common/sub-category.service";
import {ProductService} from "../../../services/common/product.service";
import {UiService} from "../../../services/core/ui.service";
import {Pagination} from "../../../interfaces/core/pagination";
import {VendorDataService} from "../../../services/common/vendor-data.service";
import {UtilsService} from "../../../services/core/utils.service";
import {ReloadService} from "../../../services/core/reload.service";
import {FilterData} from "../../../interfaces/core/filter-data";
import {HttpClient} from "@angular/common/http";
import {Category} from "../../../interfaces/common/category.interface";
import {SubCategory} from "../../../interfaces/common/sub-category.interface";
import {ProductFilter} from "../../../services/common/product-filter";
import { MatCheckbox } from '@angular/material/checkbox';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, AfterViewInit, OnDestroy {

  // Selected Data
  selectedIds: string[] = [];
  @ViewChild('matCheckbox') matCheckbox: MatCheckbox;
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

  // SEARCH AREA
  searchProducts: Product[] = [];
  isLoading = false;
  isSelect = false;
  searchQuery = null;
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('searchInput') searchInput: ElementRef;

  // Vendor
  vendor: Vendor = null;

  // Query
  query: any = null;

  // Select View Child
  @ViewChild('matCatSelect') matCatSelect: MatSelect;
  @ViewChild('matSubCatSelect') matSubCatSelect: MatSelect;

  // DOWNLOADABLE
  dataTypeFormat = 'json';

    // Subscriptions
    private subDataOne: Subscription;
    private subDataTwo: Subscription;
    private subDataThree: Subscription;
    private subDataFour: Subscription;
    private subDataFive: Subscription;
    private subDataSix: Subscription;
    private subDataSeven: Subscription;
    private subDataEight: Subscription;
    private subRouteOne: Subscription;
    private subReload: Subscription;

  constructor(
    private productService: ProductService,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private dialog: MatDialog,
    private reloadService: ReloadService,
    private uiService: UiService,
    private utilsService: UtilsService,
    private vendorDataService: VendorDataService
  ) {
  }

  ngOnInit(): void {

    // GET PAGE FROM QUERY PARAM
    this.subAcRoute = this.activatedRoute.queryParams.subscribe((qParam:any) => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      this.getAllProducts();
    });

    this.getLoggedInVendorInfo();
    this.getAllCategory();

    // // GET
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
          filter: this.query,
          select: mSelect,
          sort: this.sortQuery
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

  private getLoggedInVendorInfo() {
    this.vendorDataService.getLoginVendorInfo()
      .subscribe(res => {
        this.vendor = res.data;
        this.query = {...this.query, ...{vendor: this.vendor._id}};
        console.log("Query from get logged in vendor info", this.query)
        this.getAllProducts();
      }, err => {
        console.log(err);
      });
  }

  /**
   * COMPONENT DIALOG VIEW
   */
  public openConfirmDialog(id: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this product?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteProductById(id);
      }
    });
  }

  public openConfirmUploadDialog(data: Product[]) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Import Data!',
        message: 'Warning! All the existing data will be replace'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.insertManyProduct(data);
      }
    });
  }


  /**
   * HTTP REQ
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
      filter: this.query,
      select: mSelect,
      sort: this.sortQuery
    }


    this.subDataOne = this.productService.getAllProducts(filterData, this.searchQuery)
      .subscribe(res => {
        this.spinner.hide();
        this.products = res.data;
        if (this.products && this.products.length) {
          this.products.forEach((m, i) => {
            const index = this.selectedIds.findIndex(f => f === m._id);
            this.products[i].select = index !== -1;
          });
          console.log("this.products ",this.products );
          
          this.totalProducts = res.count;
          if (!this.searchQuery) {
            this.holdPrevData = res.data;
            this.totalProductsStore = res.count;
          }

          this.checkSelectionData();
        }
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  private checkSelectionData() {
    let isAllSelect = true;
    this.products.forEach(m => {
      if (!m.select) {
        isAllSelect = false;
      }
    });

    this.matCheckbox.checked = isAllSelect;
  }

  private getAllCategory() {

    const mSelect = {
      name: 1,
      slug: 1,
      image: 1,
      serial: 1,
      status: 1,
      readOnly: 1,
      createdAt: 1,
    }

    const filterData: FilterData = {
      pagination: null,
      filter: null,
      select: mSelect,
      sort: null
    }
    this.subCat = this.categoryService.getAllCategories(filterData)
      .subscribe(res => {
        this.categories = res.data;
        console.log("this.categories",this.categories);
      }, error => {
        console.log(error);
      });
  }

  private getAllSubCategory(categoryId: string) {
    this.subCategoryService.getSubCategoryByCategoryId(categoryId)
    .subscribe(res => {
      this.subCategories = res.data;
    }, error => {
      console.log(error);
    });
   
  }


  private insertManyProduct(data: Product[]) {
    this.spinner.show();
    this.productService.insertManyProduct(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshProduct$();
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  private deleteProductById(productId: string) {
    this.spinner.show();
    this.productService.deleteProductById(productId)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshProduct$();
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
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
      this.query = {...this.query, ...{vendor: this.vendor._id}};
      this.query = {...this.query, 'category._id': category._id};
  
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
      let subCategory = event.source.value as SubCategory;
      this.query = {...this.query, ...{vendor: this.vendor._id}};
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
    this.query = {...this.query, ...{vendor: this.vendor._id}};
    this.router.navigate([], {queryParams: {page: null}, queryParamsHandling: 'merge'});
    this.getAllProducts();
  }

  /**
   * IMPORT EXCEL DATA
   * FILE CHANGE EVENT
   */

  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    if (this.dataTypeFormat === 'excel') {
      reader.onload = (event) => {
        const data = reader.result;
        workBook = XLSX.read(data, {type: 'binary'});
        jsonData = workBook.SheetNames.reduce((initial, name) => {
          const sheet = workBook.Sheets[name];
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          return initial;
        }, {});

        // Modify Attributes
        const allData = jsonData.products;
        const mData: Product[] = allData.map(m => {
          const dataNameFieldString = m.productName.toString().trim();
          return {
            ...m,
            ...{productSlug: this.utilsService.transformToSlug(dataNameFieldString)},
            ...{attributes: m.attributes ? m.attributes.toString().trim().split('#') : null},
            ...{images: m.images ? m.images.toString().trim().split('#') : null},
            ...{tags: m.tags ? m.tags.toString().trim().split('#') : null},
            ...{filterData: []}
          } as Category;
        });
        this.openConfirmUploadDialog(mData);
      };
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file, 'UTF-8');
      reader.onload = () => {
        const products = JSON.parse(reader.result.toString());
        const mProducts: Product[] = products.map(m => {
          const dataNameFieldString = m.productName.toString().trim();
          return {
            ...m,
            ...{productSlug: this.utilsService.transformToSlug(dataNameFieldString)}
          } as Category;
        });
        this.openConfirmUploadDialog(mProducts);
      };
      reader.onerror = (error) => {
        console.log(error);
      };
    }
  }

  protected getFilterStringToMain(str: string): FilterData[] | null {
    if (str) {
      const testStr = '{ "_id": "60e04834a320de0484f97116", "attributeValues": "1.21-1.28", "attributeName": "COOLING INPUT POWER (KW)	"}';
      const cArray = str.split('#');
      const mTestStr = testStr.split(/\s/).join('');

      // const obj = {};
      // properties.forEach(property => {
      //   const mProperty = property.trim();
      //   // console.log(mProperty);
      //   const tup = mProperty.split(':');
      //   obj[tup[0]] = tup[1];
      // });
      // console.log(obj as ProductAttribute);


      return cArray.map(m => {
        // console.log(m);
        // const h = JSON.parse(m);
        // console.log(h);
        // @ts-ignore
        // const g = Object.fromEntries(m.split(',').map(i => i.split(':')));
        // console.log(m);
        // tslint:disable-next-line:no-eval
        // const evalData = eval(m);
        // console.log(evalData);
        return null;
      }) as FilterData[];
    } else {
      return null;
    }

  }

  exportDataToFile() {
    if (this.dataTypeFormat === 'json') {
      this.exportAsAJson();
    } else {
      this.exportToExcel();
    }
  }


  /**
   * EXPORTS TO EXCEL
   */
  exportToExcel() {
    this.spinner.show();
    this.productService.getAllProducts(null, null)
      .subscribe(res => {
        const allData = res.data as Product[];

        const mData = allData.map(m => {
          const fData = m.filterData ? m.filterData.map(m2 => `{ "_id": "${m2._id}", "attributeValues": "${m2.attributeValues}", "attributeName": "${m2.attributeName}" }`) : null;
          const fModified = fData && fData.length > 0 ? this.utilsService.arrayToString(fData, '#') : null;
          return {
            ...m,
            // @ts-ignore
            category: m.category._id,
            // @ts-ignore
            subCategory: m.subCategory ? m.subCategory._id : null,
            // @ts-ignore
            brand: m.brand ? m.brand._id : null,
            attributes: m.attributes ? this.utilsService.arrayToString(m.attributes.map(m2 => m2._id), '#') : null,
            tags: m.tags ? this.utilsService.arrayToString(m.tags.map(m2 => m2._id), '#') : null,
            images: m.images ? this.utilsService.arrayToString(m.images.map(m2 => m2), '#') : null,
            filterData: fModified
          };
        });


        const date = this.utilsService.getDateString(new Date());
        // EXPORT XLSX
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'products');
        XLSX.writeFile(wb, `Products_Backup_${date}.xlsx`);
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  /**
   * DOWNLOADABLE JSON
   */
  exportAsAJson() {
    this.productService.getAllProducts(null, null)
      .subscribe(res => {
        const allData = res.data as Product[];

        const blob = new Blob([JSON.stringify(allData, null, 2)], {type: 'application/json'});
        this.dialog.open(DownloadJsonDialogComponent, {
          maxWidth: '500px',
          data: {
            blobUrl: window.URL.createObjectURL(blob),
            backupType: 'products'
          }
        });
      }, error => {
        console.log(error);
      });

  }

  /**
   * CLONE PRODUCT
   */

  private cloneSingleProduct(id: string) {
    this.spinner.show();
    this.subDataEight = this.productService.cloneSingleProduct(id)
      .subscribe(res => {
        this.spinner.hide();
        if (res.success) {
          this.uiService.success(res.message);
          this.reloadService.needRefreshData$();
        } else {
          this.uiService.warn(res.message);
        }
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
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
