import {Component, OnInit, ViewChild} from '@angular/core';
import {Brand} from '../../interfaces/common/brand.interface';
import {debounceTime, distinctUntilChanged, EMPTY, pluck, Subscription, switchMap} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {UiService} from '../../services/core/ui.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ActivatedRoute, Router} from '@angular/router';
import {UtilsService} from '../../services/core/utils.service';
import {ReloadService} from '../../services/core/reload.service';
import {BrandService} from '../../services/common/brand.service';
import {Pagination} from '../../interfaces/core/pagination';
import {FilterData} from '../../interfaces/core/filter-data';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {
  @ViewChild('searchForm') searchForm: NgForm;

  // Store Data
  brands: Brand[] = [];
  holdPrevData: Brand[] = [];

  // Loading
  isLoading: boolean = true;

  // Pagination
  currentPage = 1;
  totalBrands = 0;
  brandsPerPage = 15;
  totalBrandsStore = 0;

  // SEARCH AREA
  searchQuery = null;
  searchBrands: Brand[] = [];



  // Subscriptions
  private subReload: Subscription;
  private subRouteOne: Subscription;
  private subForm: Subscription;
  private subDataOne: Subscription;

  constructor(
    private dialog: MatDialog,
    private brandService: BrandService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    ) { }


  /**
   * Life cycle hook
   * ngOnInit()
   * ngAfterViewInit()
   * */
  ngOnInit(): void {
    this.subReload = this.reloadService.refreshData$
      .subscribe(() => {
        this.getAllBrands();
      });

    // GET PAGE FROM QUERY PARAM
    this.subRouteOne = this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam['page']) {
        this.currentPage = qParam['page'];
      } else {
        this.currentPage = 1;
      }
      this.getAllBrands();
    });
  }

  ngAfterViewInit(): void {
    const formValue = this.searchForm.valueChanges;

    this.subForm = formValue.pipe(
      pluck('searchTerm'),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(data => {
        this.searchQuery = data;
        if (this.searchQuery === '' || this.searchQuery === null) {
          this.searchBrands = [];
          this.brands = this.holdPrevData;
          this.totalBrands = this.totalBrandsStore;
          this.searchQuery = null;
          return EMPTY;
        }
        const pagination: Pagination = {
          pageSize: Number(this.brandsPerPage),
          currentPage: Number(this.currentPage) - 1
        };
        // Select
        const mSelect = {
          name: 1,
          slug: 1,
          image: 1,
          priority: 1,
          brand: 1,
          readOnly: 1,
          createdAt: 1,
        }

        const filterData: FilterData = {
          pagination: pagination,
          filter: null,
          select: mSelect,
          sort: {priority: -1}
        }
        return this.brandService.getAllBrands(filterData, this.searchQuery);
      })
    )
      .subscribe(res => {
        this.searchBrands = res.data;
        this.brands = this.searchBrands;
        this.totalBrands = res.count;
        this.currentPage = 1;
        this.router.navigate([], {queryParams: {page: this.currentPage}});
      }, error => {
        console.log(error)
      });
  }

  /**
   * PAGINATION CHANGE
   * onPageChanged()
   */
  public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}});
  }


  /**
   * HTTP REQ HANDLE
   * getAllBrands()
   * deleteBrandById()
   * deleteMultipleBrandById()
   * updateMultipleBrandById()
   */

  private getAllBrands() {
    this.spinner.show();
    const pagination: Pagination = {
      pageSize: Number(this.brandsPerPage),
      currentPage: Number(this.currentPage) - 1
    };

    const mSelect = {
      name: 1,
      slug: 1,
      image: 1,
      priority: 1,
      brand: 1,
      readOnly: 1,
      createdAt: 1,
    }

    const filterData: FilterData = {
      pagination: pagination,
      filter: null,
      select: mSelect,
      sort: {priority: -1}
    }


    this.subDataOne = this.brandService.getAllBrands(filterData, this.searchQuery)
      .subscribe(res => {
        this.spinner.hide();
        this.brands = res.data;
        if (this.brands && this.brands.length) {

          this.totalBrands = res.count;
          if (!this.searchQuery) {
            this.holdPrevData = res.data;
            this.totalBrandsStore = res.count;
          }

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
    if (this.subReload) {
      this.subReload.unsubscribe();
    }
    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }
    if (this.subForm) {
      this.subForm.unsubscribe();
    }
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
  }

}
