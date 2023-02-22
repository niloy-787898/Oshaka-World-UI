import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';

import {MatSelectChange} from '@angular/material/select';

import {NgxSpinnerService} from 'ngx-spinner';

import {MatDialog} from '@angular/material/dialog';
import {ImageGalleryDialogComponent} from '../../image-gallery-dialog/image-gallery-dialog.component';
import {MatOption, MatOptionSelectionChange} from '@angular/material/core';
import {SubCategoryService} from "../../../../services/common/sub-category.service";
import {TagService} from "../../../../services/common/tag.service";
import {CatalogInfo, Product} from "../../../../interfaces/common/product.interface";
import {ActivatedRoute, Router} from "@angular/router";
import {Vendor} from "../../../../interfaces/common/vendor";
import {VendorProductService} from "../../../../services/common/vendor-product.service";
import {StorageService} from "../../../../services/core/storage.service";
import {UiService} from "../../../../services/core/ui.service";
import {Pagination} from "../../../../interfaces/core/pagination";
import {VendorDataService} from "../../../../services/common/vendor-data.service";
import {ProductService} from "../../../../services/common/product.service";
import {Select} from "../../../../interfaces/core/select";
import {UtilsService} from "../../../../services/core/utils.service";
import {CategoryService} from "../../../../services/common/category.service";
import {BrandService} from "../../../../services/common/brand.service";
import {FilterData} from "../../../../interfaces/core/filter-data";
import {Brand} from "../../../../interfaces/common/brand.interface";
import {Category} from "../../../../interfaces/common/category.interface";
import {SubCategory} from "../../../../interfaces/common/sub-category.interface";
import {Tag} from "../../../../interfaces/common/tag.interface";
import {TextEditorCtrService} from "../../../../services/common/text-editor-ctr.service";
import {ImageGallery} from "../../../../interfaces/gallery/image-gallery";
import {ProductAttribute} from "../../../../interfaces/common/product-attribute";
import {AttributeService} from "../../../../services/common/attribute.service";


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit, OnDestroy {

  private sub?: Subscription;

  vendor: Vendor = null;

  dataForm?: FormGroup;
  filterDataArray?: FormArray;
  autoSlug = true;

  // FOR RESET
  @ViewChild('formTemplate') formTemplate: NgForm;

  // Image
  chooseImage?: string[] = [];


  discountType: Select[] = [
    {
      value: 1,
      viewValue: 'Percentage'
    },
    {
      value: 2,
      viewValue: 'Cash'
    },
  ];

  stockVisibilities: Select[] = [
    {
      value: true,
      viewValue: 'Show Stock'
    },
    {
      value: false,
      viewValue: 'Hide Stock'
    },
  ];

  productsVisibilities: Select[] = [
    {
      value: true,
      viewValue: 'Visible'
    },
    {
      value: false,
      viewValue: 'Hide'
    },
  ];


  // SELECT DATA
  brands: Brand[] = [];
  categories: Category[] = [];
  subCategories: SubCategory[] = [];
  attributes: ProductAttribute[] = [];
  tags: Tag[] = [];

  // Select Filter
  public filteredCatList: Category[];
  public filteredSubCatList: SubCategory[];
  public filteredBrandList: Brand[];
  public filteredAttributesList: ProductAttribute[];

  // Hierarchy Attributes;
  categoryAttributes: ProductAttribute[] = [];
  subCategoryAttributes: ProductAttribute[] = [];


  // Selected Attributes
  selectedAttributes: ProductAttribute[] = [];
  @ViewChild('attributeOpt') attributeOpt: MatOption;

  // Store Product
  id: string = null;
  product: Product = null;
  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;
  private subDataFive: Subscription;
  private subDataSix: Subscription;
  private subDataSeven: Subscription;
  private subDataEight: Subscription;
  private subAutoSlug: Subscription;

  constructor(
    private fb: FormBuilder,
    private utilsService: UtilsService,
    private uiService: UiService,
    private storageService: StorageService,
    public router: Router,
    private attributeService: AttributeService,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private productService: ProductService,
    private spinnerService: NgxSpinnerService,
    private tagService: TagService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    public textEditorCtrService: TextEditorCtrService,
    private dialog: MatDialog,
    private vendorDataService: VendorDataService,
    private vendorProductService: VendorProductService,
  ) {
  }

  ngOnInit(): void {
    // INIT FORM
    this.initFormGroup();

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getSingleProductById();
      } else {
        // GET ALL SELECTED DATA
        // this.getAllAttributes();
        this.getAllCategory();
        // this.getAllSubCategory();
        this.getAllBrands();
        this.getAllTags();
      }
    });

    // Auto Generate Slug
    this.autoGenerateSlug();

    this.getLoggedInVendorInfo();
  }

  private getLoggedInVendorInfo() {
    this.vendorDataService.getLoginVendorInfo()
      .subscribe(res => {
        this.vendor = res.data;
      }, err => {
        console.log(err);
      });
  }

  /**
   * OPEN COMPONENT DIALOG
   */

  public openComponentDialog() {
    const dialogRef = this.dialog.open(ImageGalleryDialogComponent, {
      panelClass: ['theme-dialog', 'full-screen-modal-lg'],
      width: '100%',
      minHeight: '100%',
      autoFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.data && dialogResult.data.length > 0) {
          this.getPickedImages(dialogResult.data);
        }
      }
    });
  }


  /**
   * GET IMAGE DATA FROM STATE
   */
  private getPickedImages(images: ImageGallery[]) {
    if (this.chooseImage && this.chooseImage.length > 0) {
      const nImages = images.map(m => m.url);
      this.chooseImage = this.utilsService.mergeArrayString(nImages, this.chooseImage);
    } else {
      this.chooseImage = images.map(m => m.url);
    }
    this.dataForm.patchValue(
      {images: this.chooseImage}
    );
  }


  /**
   * INIT FORM
   */
  private initFormGroup() {
    this.dataForm = this.fb.group({
      productName: [null, Validators.required],
      productSlug: [null, Validators.required],
      productNameBangla: [null, Validators.required],
      images: [null],
      sku: [null],
      price: [null, Validators.required],
      discountType: [null],
      discountAmount: [null],
      stockVisibility: [null],
      productVisibility: [null],
      quantity: [null],
      soldQuantity: [null],
      category: [null],
      categorySlug: [null],
      subCategory: [null],
      subCategorySlug: [null],
      brand: [null],
      brandSlug: [null],
      tags: [null],
      warrantyServices: [null],
      shortDescription: [null],
      description: [null],
      attributes: [null],
      deliveryPolicy: [null],
      paymentPolicy: [null],
      warrantyPolicy: [null],
      shippingCharge: [null],
      commission: [null, Validators.required],
      filterData: this.fb.array([])
    });

    this.filterDataArray = this.dataForm.get('filterData') as FormArray;
  }


  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required field');
      return;
    }
    this.spinner.show();
    let subCategorySlug;
    const rawData = this.dataForm.value;
    const categorySlug = this.categories.find(f => f._id === rawData.category.categorySlug);
    if (rawData.subCategory) {
      subCategorySlug = this.subCategories.find(f => f._id === rawData.subCategory.subCategorySlug);
    }
    const brandSlug = this.brands.find(f => f._id === rawData.brand.brandSlug);
    const images = this.chooseImage;
    const mData = {
      categorySlug,
      subCategorySlug: subCategorySlug ? subCategorySlug : null,
      brandSlug, images,
      campaignStartDate: rawData.campaignStartDate ? this.utilsService.getDateWithCurrentTime(rawData.campaignStartDate) : null,
      campaignEndDate: rawData.campaignEndDate ? this.utilsService.getDateWithCurrentTime(rawData.campaignEndDate) : null
    };
    const finalData = {
      ...rawData,
      ...mData
    };

    if (this.id) {
      const mDataEdit = {...finalData, ...{_id: this.id}};
      this.editProductById(mDataEdit);
    } else {
      this.addSingleProduct({...finalData, ...{rating: 0, approval: 'not_approved'}});
    }

  }


  /**
   * AUTO CALCULATE AND FORM INPUT
   */
  autoGenerateSlug() {
    if (this.autoSlug === true) {
      this.sub = this.dataForm?.get('productName').valueChanges
        .pipe(
        ).subscribe(d => {
          const slug = this.utilsService.transformToSlug(d ? d : '');
          this.dataForm?.patchValue({
            productSlug: slug
          });
        });
    } else {
      if (this.sub === null || this.sub === undefined) {
        return;
      }
      this.sub.unsubscribe();
    }
  }


  /**
   * ON HOLD DATA
   */

  onHoldInputData() {
    this.storageService.storeInputData(this.dataForm?.value, 'PRODUCT_INPUT');
  }

  /**
   * REMOVE SELECTED IMAGE
   */
  removeSelectImage(s: string) {
    const index = this.chooseImage.findIndex(x => x === s);
    this.chooseImage.splice(index, 1);
  }

  /**
   * PATCH FORM ARRAY
   */
  private patchFormValueWithArray() {
    // const filterData = this.product?.filterData as FilterData[];
    if (this.product && this.product.filterData && this.product.filterData.length > 0) {
      this.selectedAttributes = this.product.filterData.map(m => {
        return {
          _id: m._id,
          attributeName: m.attributeName,
          attributeSlug: this.utilsService.transformToSlug(m.attributeName),
          attributeValues: this.attributes.find(f => f._id === m._id).attributeValues
        } as ProductAttribute;
      });
      this.product.filterData.map((m, i) => {
        const f = this.fb.group({
          _id: [m._id],
          attributeName: [m.attributeName],
          attributeValues: [m.attributeValues],
        });
        (this.dataForm?.get('filterData') as FormArray).push(f);
      });
    }

  }

  private patchFormData() {
    this.chooseImage = this.product.images;
    this.dataForm.patchValue(this.product);
  }

  /**
   * SELECTION CHANGE
   */

  onSelectCategory(event: MatSelectChange) {
    this.categoryAttributes = this.categories.find(f => f._id === event.value).attributes as ProductAttribute[];
    this.dataForm.patchValue({subCategory: null});
    // this.removeAttributesFormArray();
    this.getAllSubCategoryByCategoryId(event.value, true);
  }

  onSelectSubCategory(event: MatSelectChange) {
    // this.dataForm.patchValue({filterData: null, attributes: null});
    // this.removeAttributesFormArray();
    this.subCategoryAttributes = this.subCategories.find(f => f._id === event.value).attributes as ProductAttribute[];
    // this.hierarchyAttributes();
  }

  onSelectAttribute(event: MatOptionSelectionChange) {


    const index = this.selectedAttributes.findIndex(x => x._id === event.source.value);

    if (event.source.selected) {
      if (index === -1) {
        if (event.isUserInput) {
          const attributeObj = this.attributes.find(data => data._id === event.source.value);
          this.selectedAttributes.push(attributeObj);
          const f = this.fb.group({
            _id: [attributeObj._id],
            attributeName: [attributeObj.attributeName],
            attributeValues: [null, Validators.required],
          });
          (this.dataForm?.get('filterData') as FormArray).push(f);
        }
      }
    } else {
      if (event.isUserInput) {
        this.removeAttributesField(index);
      }
    }

  }

  /**
   * REMOVE FORM BUILDER OBJECT
   */
  removeAttributesField(index: number) {
    this.filterDataArray?.removeAt(index);
    this.selectedAttributes.splice(index, 1);
  }

  private removeAttributesFormArray() {
    this.filterDataArray.controls.forEach((f, i) => {
      this.filterDataArray?.removeAt(i);
    });
    this.filterDataArray.controls.splice(0, this.filterDataArray.controls.length);
    this.selectedAttributes = [];
  }


  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  // private getAllAttributes() {
  //   this.attributeService.getAllAttributes()
  //     .subscribe(res => {
  //       this.attributes = res.data;
  //       this.filteredAttributesList = this.attributes.slice();
  //       if (this.product) {
  //         if (this.product.attributes && this.product.attributes.length > 0) {
  //           const attributesId = this.product.attributes.map(m => m._id);
  //           this.patchFormValueWithArray();
  //           this.dataForm.patchValue({attributes: attributesId});
  //         }
  //       }
  //     }, error => {
  //       console.log(error);
  //     });
  // } // MOST COMPLEX FORM ARRAY

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
    this.subDataOne = this.categoryService.getAllCategories(filterData)
      .subscribe(res => {
        this.categories = res.data;
      }, error => {
        console.log(error);
      });
  }

  private getAllSubCategory() {
    this.subCategoryService.getAllSubCategory()
      .subscribe(res => {
        this.subCategories = res.data;
        this.filteredSubCatList = this.subCategories.slice();
        if (this.product) {
          const subCategory = this.product?.subCategory as CatalogInfo;
          if (subCategory) {
            this.dataForm.patchValue({subCategory: this.subCategories.find(f => f._id === subCategory._id)._id});
          }
        }
      }, error => {
        console.log(error);
      });
  }

  private getAllSubCategoryByCategoryId(categoryId: string, selectionChange: boolean) {
    this.subCategoryService.getSubCategoryByCategoryId(categoryId)
      .subscribe(res => {
        this.subCategories = res.data;
        this.filteredSubCatList = this.subCategories.slice();
        // if (this.product) {
        //   this.subCategories.forEach(f => {
        //     this.subCategoryAttributes = f.attributes as Attribute[];
        //   });
        //   console.log(this.subCategoryAttributes);
        //   this.hierarchyAttributes();
        // }
        if (this.product && !selectionChange) {
          const subCategory = this.product.subCategory as CatalogInfo;
          this.dataForm.patchValue({subCategory: this.subCategories.find(f => f._id === subCategory._id)._id});
        }
      }, error => {
        console.log(error);
      });
  }


  private getAllBrands() {

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
      pagination: null,
      filter: null,
      select: mSelect,
      sort: {createdAt: -1}
    }
    this.brandService.getAllBrands(filterData)
      .subscribe(res => {
        this.brands = res.data;
        this.filteredBrandList = this.brands.slice();
        if (this.product) {
          const brand = this.product.brand as CatalogInfo;
          this.dataForm.patchValue({brand: this.brands.find(f => f._id === brand._id)._id});
        }
      }, error => {
        console.log(error);
      });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAllTags() {
    // Select
    const mSelect = {
      name: 1,
      slug: 1
    }

    const filterData: FilterData = {
      pagination: null,
      filter: null,
      select: mSelect,
      sort: {name: 1}
    }


    this.subDataSix = this.tagService.getAllTags(filterData, null)
      .subscribe(res => {
        this.tags = res.data;
      }, error => {
        console.log(error);
      });
  }
  

  private addSingleProduct(data: any) {
    this.spinnerService.show();
    this.subDataOne = this.productService.addProduct(data)
      .subscribe(res => {
        this.spinnerService.hide();
        if (res.success) {
          this.uiService.success(res.message);
          this.formTemplate.resetForm();
          this.chooseImage = [];
        } else {
          this.uiService.warn(res.message);
        }
      }, error => {
        this.spinnerService.hide();
        console.log(error);
      });
  }

  private editProductById(data: any) {
    this.vendorProductService.editProductById(data)
      .subscribe(res => {
        this.spinner.hide();
        this.uiService.success(res.message);
        this.storageService.removeSessionData('PRODUCT_INPUT');
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  private getSingleProductById() {
    this.spinnerService.show();
    // const select = 'name email username phoneNo gender role permissions hasAccess'
    this.subDataTwo = this.productService.getProductById(this.id)
      .subscribe(res => {
        this.spinnerService.hide();
        if (res.success) {
          this.product = res.data;
          this.setFormValue();
        }
      }, error => {
        this.spinnerService.hide();
        console.log(error);
      });
  }
  private setFormValue() {
    this.dataForm.patchValue({
        ...this.product,
        ...{
          category: this.product.category._id,
          brand: this.product.brand._id,
        }
      }
    );

    if (this.product.subCategory) {
      this.dataForm.patchValue({
        subCategory: this.product.subCategory._id,
      })
    }

    // Tags
    if (this.product.tags && this.product.tags.length) {
      this.dataForm.patchValue({
        tags: this.product.tags.map(m => m._id)
      })
    }

    // Variations
    if (this.product.specifications && this.product.specifications.length) {
      this.product.specifications.map(m => {
        const f = this.fb.group({
          name: [m.name, Validators.required],
          value: [m.value, Validators.required],
        });
        (this.dataForm?.get('specifications') as FormArray).push(f);
      });
    }

    if (this.product.hasVariations) {
      this.dataForm.patchValue({
        variations: this.product.variations.map(m => m._id)
      });

      this.product.variationsOptions.map(m => {
        const f = this.fb.group({
          price: [m.price, Validators.required],
          quantity: [m.quantity, Validators.required],
          image: [m.image],
          variations: [m.variations]
        });
        (this.dataForm?.get('variationsOptions') as FormArray).push(f);
      });
    }

    // Set Image
    if (this.product.images && this.product.images.length) {
      this.chooseImage = this.product.images;
    }
    // Get Sub Category By Category
    if (this.product.subCategory) {
      this.getSubCategoriesByCategoryId(this.product.category._id);
    }
  }
    private getSubCategoriesByCategoryId(categoryId: string) {
    this.subDataSeven = this.subCategoryService.getSubCategoryByCategoryId(categoryId)
      .subscribe(res => {
        this.subCategories = res.data;
      }, error => {
        console.log(error);
      });
  }

  private hierarchyAttributes() {
    this.attributes = this.utilsService.margeMultipleArrayUnique('_id', this.categoryAttributes, this.subCategoryAttributes);
    this.filteredAttributesList = this.attributes.slice();
    // console.log(this.attributes);
    if (this.product) {
      if (this.product.attributes && this.product.attributes.length > 0) {
        const attributesId = this.product.attributes.map(m => m._id);
        this.dataForm.patchValue({attributes: attributesId});
        this.patchFormValueWithArray();
      }
    }

  }

  /**
   * RESET FORM STATE
   */

  private resetForm() {
    this.formTemplate.resetForm();
    this.filterDataArray = null;
    this.chooseImage = [];
    this.selectedAttributes = [];
    this.initFormGroup();
    this.autoGenerateSlug();
  }


  ngOnDestroy() {
    this.storageService.removeSessionData('PRODUCT_INPUT');
    if (this.sub) {
      this.sub.unsubscribe();
    }

  }

}
