import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {NgxSpinnerService} from 'ngx-spinner';
import {Subscription} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {ProductTableComponent} from '../../components/product-table/product-table.component';
import {Product} from "../../../../interfaces/common/product.interface";
import {UiService} from "../../../../services/core/ui.service";
import {ProductService} from "../../../../services/common/product.service";
import {StorageService} from "../../../../services/core/storage.service";
import {BannerService} from "../../../../services/common/banner.service";
import {Banner} from "../../../../services/common/banner";

@Component({
  selector: 'app-add-new-banner',
  templateUrl: './add-new-banner.component.html',
  styleUrls: ['./add-new-banner.component.scss']
})
export class AddNewBannerComponent implements OnInit {

  // Subscriptions
  private subProduct: Subscription;

  // Admin Base Url
  readonly adminBaseUrl = environment.adminBaseUrl;

  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  dataForm: FormGroup;
  private sub: Subscription;

  isLoading = false;

  // Store Data from param
  id?: string;
  banner: Banner = null;
  products: Product[] = [];

  // Image Holder
  placeholder = '/assets/images/avatar/image-upload.jpg';
  pickedImage?: string;

  // From Dialog
  selectedProductIds: string[] = [];

  // Destroy Session
  needSessionDestroy = true;


  constructor(
    private fb: FormBuilder,
    private bannerService: BannerService,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private storageService: StorageService,
    public router: Router,
    private dialog: MatDialog,
    private productService: ProductService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      priority: [null],
      shortDesc: [null, Validators.required],
      info: [null],
      image: [null],
      routerLink: [null, Validators.required],
      products: [null, Validators.required]
    });

    this.pickedImage = this.placeholder;

    // Image From state
    if (!this.id) {
      // IF HAVE DATA ON SESSION
      if (this.storageService.getStoredInput('BANNER_INPUT')) {
        this.dataForm.patchValue(this.storageService.getStoredInput('BANNER_INPUT'));
      }
      if (this.dataForm.value.products && this.dataForm.value.products.length > 0) {
        // this.getSpecificProductsById(this.dataForm.value.products);
      }
      if (history.state.images) {
        this.needSessionDestroy = true;
        this.pickedImage = history.state.images[0].url;
        this.dataForm.patchValue(
          {image: this.pickedImage}
        );
      }
    }

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getSingleBannerById();
      }
    });
  }

  /**
   * SET FORM DATA
   */
  private setFormData() {
    this.dataForm.patchValue(this.banner);

    if (this.storageService.getStoredInput('BANNER_INPUT')) {
      this.dataForm.patchValue(this.storageService.getStoredInput('BANNER_INPUT'));
    }

    if (history.state.images) {
      this.needSessionDestroy = true;
      this.pickedImage = history.state.images[0].url;
      this.dataForm.patchValue(
        {image: this.pickedImage}
      );
    } else {
      this.pickedImage = this.banner.image ? this.banner.image : this.placeholder;
    }
  }

  /**
   * OPEN COMPONENT DIALOG
   */
  public openComponentDialog(data?: any) {
    const dialogRef = this.dialog.open(ProductTableComponent, {
      data: this.banner ? this.products.map(m => m._id) : null,
      panelClass: ['theme-dialog', 'full-screen-modal'],
      width: '100%',
      minHeight: '60%',
      autoFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.selectedIds) {
          this.selectedProductIds = dialogResult.selectedIds;
          this.dataForm.patchValue({products: dialogResult.selectedIds});
          // this.getSpecificProductsById(this.selectedProductIds);
        }
      }
    });
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }

    if (this.id) {
      const finalData = {...this.dataForm.value, ...{_id: this.id}};
      this.editDealOnPlay(finalData);
    } else {
      this.addNewDealOnPlay(this.dataForm.value);
    }

  }

  onHoldInputData() {

  }

  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  private addNewDealOnPlay(data: Banner) {
    this.bannerService.addNewBanner(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.templateForm.resetForm();
        this.storageService.removeSessionData('BANNER_INPUT');
        this.pickedImage = this.placeholder;
        this.selectedProductIds = [];
        this.products = [];
      }, err => {
        console.log(err);
      });
  }

  private editDealOnPlay(data: Banner) {
    this.bannerService.editBanner(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.storageService.removeSessionData('BANNER_INPUT');
      }, err => {
        console.log(err);
      });
  }

  private getSingleBannerById() {
    const selectProductField = '-attributes -filterData -tags -ratingReview -discussion -warrantyServices -description';
    this.bannerService.getSingleBannerById(this.id, selectProductField)
      .subscribe(res => {
        this.banner = res.data;
        this.products = this.banner.products as Product[];
        this.setFormData();
      }, error => {
        console.log(error);
      });
  }

  // private getSpecificProductsById(ids: string[]) {
  //   this.spinner.show();
  //   const selectProductField = '-attributes -filterData -tags -ratingReview -discussion -warrantyServices -description';
  //   this.subProduct = this.productService.getSpecificProductsById(ids, selectProductField)
  //     .subscribe(res => {
  //       this.products = res.data;
  //       console.log('My Product.......');
  //       console.log(this.products);
  //       this.spinner.hide();
  //     }, error => {
  //       this.spinner.hide();
  //       console.log(error);
  //     });
  // }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.subProduct) {
      this.subProduct.unsubscribe();
    }
    if (this.needSessionDestroy) {
      this.storageService.removeSessionData('BANNER_INPUT');
    }
  }
}
