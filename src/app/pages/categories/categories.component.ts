import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Category} from '../../interfaces/common/category.interface';
import {NgForm} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {UiService} from '../../services/core/ui.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ActivatedRoute, Router} from '@angular/router';
import {UtilsService} from '../../services/core/utils.service';
import {CategoryService} from '../../services/common/category.service';
import {ReloadService} from '../../services/core/reload.service';
import {debounceTime, distinctUntilChanged, EMPTY, pluck, Subscription, switchMap} from 'rxjs';
import {Pagination} from '../../interfaces/core/pagination';
import {FilterData} from '../../interfaces/core/filter-data';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {

  // Loading
  isLoading: boolean = true;

// Store Data
  categories: Category[] = [];
  holdPrevData: Category[] = [];

  // Pagination
  currentPage = 1;
  totalCategories = 0;
  categoriesPerPage = 10;
  totalCategoriesStore = 0;

  // SEARCH AREA
  searchCategories: Category[] = [];
  searchQuery = null;
  @ViewChild('searchForm') searchForm: NgForm;

  // Subscriptions
  private subReload: Subscription;
  private subRouteOne: Subscription;
  private subForm: Subscription;
  private subDataOne: Subscription;

  constructor(
    private dialog: MatDialog,
    private categoryService: CategoryService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    ) { }

  ngOnInit(): void {
    this.subReload = this.reloadService.refreshData$
      .subscribe(() => {
        this.getAllCategories();
      });

    // GET PAGE FROM QUERY PARAM
    this.subRouteOne = this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam['page']) {
        this.currentPage = qParam['page'];
      } else {
        this.currentPage = 1;
      }
      this.getAllCategories();
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
          this.searchCategories = [];
          this.categories = this.holdPrevData;
          this.totalCategories = this.totalCategoriesStore;
          this.searchQuery = null;
          return EMPTY;
        }
        const pagination: Pagination = {
          pageSize: Number(this.categoriesPerPage),
          currentPage: Number(this.currentPage) - 1
        };
        // Select
        const mSelect = {
          name: 1,
          slug: 1,
          image: 1,
          priority: 1,
          readOnly: 1,
          createdAt: 1,
        }

        const filterData: FilterData = {
          pagination: pagination,
          filter: null,
          select: mSelect,
          sort: {createdAt: -1}
        }
        return this.categoryService.getAllCategories(filterData, this.searchQuery);
      })
    )
      .subscribe(res => {
        this.searchCategories = res.data;
        this.categories = this.searchCategories;
        this.totalCategories = res.count;
        this.currentPage = 1;
        this.router.navigate([], {queryParams: {page: this.currentPage}});
      }, error => {
        console.log(error)
      });
  }



  /**
   * PAGINATION CHANGE
   */
  public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}});
  }


  /**
   * HTTP REQ HANDLE
   * getAllCategories()
   */

  private getAllCategories() {
    this.spinner.show();
    const pagination: Pagination = {
      pageSize: Number(this.categoriesPerPage),
      currentPage: Number(this.currentPage) - 1
    };

    const mSelect = {
      name: 1,
      slug: 1,
      image: 1,
      priority: 1,
      readOnly: 1,
      createdAt: 1,
    }

    const filterData: FilterData = {
      pagination: pagination,
      filter: null,
      select: mSelect,
      sort: {serial: -1}
    }

    this.subDataOne = this.categoryService.getAllCategories(filterData, this.searchQuery)
      .subscribe(res => {
        this.spinner.hide();
        this.categories = res.data;
        if (this.categories && this.categories.length) {

          this.totalCategories = res.count;
          if (!this.searchQuery) {
            this.holdPrevData = res.data;
            this.totalCategoriesStore = res.count;
          }
        }
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  /**
   * NG ON DESTROY
   */
  ngOnDestroy() {
    if(this.subReload){
      this.subReload.unsubscribe()
    }
    if(this.subForm){
      this.subForm.unsubscribe()
    }
    if(this.subRouteOne){
      this.subRouteOne.unsubscribe()
    }
    if(this.subDataOne){
      this.subDataOne.unsubscribe()
    }
  }

}
