import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {ProductAttribute} from "../../../../interfaces/common/product-attribute";
import {UiService} from "../../../../services/core/ui.service";
import {AttributeService} from "../../../../services/common/attribute.service";
import {Carousel} from "../../../../interfaces/common/carousel.interface";
import {UtilsService} from "../../../../services/core/utils.service";
import {StorageService} from "../../../../services/core/storage.service";
import {CustomizationService} from "../../../../services/common/customization.service";

@Component({
  selector: 'app-add-carousel',
  templateUrl: './add-carousel.component.html',
  styleUrls: ['./add-carousel.component.scss']
})
export class AddCarouselComponent implements OnInit, OnDestroy {

  dataForm: FormGroup;

  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  // Store Data from param
  id?: string;
  carousel: Carousel = null;

  // Image Holder
  placeholder = '/assets/images/avatar/image-upload.jpg';
  pickedImage?: string;

  attributes: ProductAttribute[] = [];

  // Destroy Session
  needSessionDestroy = true;


  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private customizationService: CustomizationService,
    private attributeService: AttributeService,
    private uiService: UiService,
    private utilsService: UtilsService,
    private storageService: StorageService,
    public router: Router,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      title: [null, Validators.required],
      url: [null, Validators.required],
      image: [null],
    });

    this.pickedImage = this.placeholder;

    // Image From state
    if (!this.id) {

      // IF HAVE DATA ON SESSION
      if (this.storageService.getStoredInput('CAROUSEL_INPUT')) {
        this.dataForm.patchValue(this.storageService.getStoredInput('CAROUSEL_INPUT'));
      }


      // Image From state
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
        this.getSingleCarouselById();
      }

    });

  }


  /**
   * SET FORM DATA
   */
  private setFormData() {
    this.dataForm.patchValue(this.carousel);

    if (this.storageService.getStoredInput('CAROUSEL_INPUT')) {
      this.dataForm.patchValue(this.storageService.getStoredInput('CAROUSEL_INPUT'));
    }

    if (history.state.images) {
      this.needSessionDestroy = true;
      this.pickedImage = history.state.images[0].url;
      this.dataForm.patchValue(
        {image: this.pickedImage}
      );
    } else {
      this.pickedImage = this.carousel.image ? this.carousel.image : this.placeholder;
    }
  }


  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }

    const mUrl = this.utilsService.urlToRouter(this.dataForm.value.url, true);
    const mData = {...this.dataForm.value, ...{url: mUrl}};

    if (this.id) {
      const finalData = {...mData, ...{_id: this.id}};
      this.editCarouselById(finalData);
    } else {
      this.addNewCarousel(mData);
    }

  }

  /**
   * ON HOLD INPUT DATA
   */

  onHoldInputData() {
    this.needSessionDestroy = false;
    this.storageService.storeInputData(this.dataForm?.value, 'CAROUSEL_INPUT');
  }

  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */



  private addNewCarousel(data: Carousel) {
    this.spinner.show();
    this.customizationService.addNewCarousel(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.templateForm.resetForm();
        this.storageService.removeSessionData('CAROUSEL_INPUT');
        this.pickedImage = this.placeholder;
        this.carousel = null;
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  private getSingleCarouselById() {
    this.spinner.show();
    this.customizationService.getSingleCarouselById(this.id)
      .subscribe(res => {
        if (res.data) {
          this.carousel = res.data;
          this.setFormData();
        }
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  private editCarouselById(data: Carousel) {
    this.spinner.show();
    this.customizationService.editCarouselById(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.storageService.removeSessionData('CAROUSEL_INPUT');
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }


  ngOnDestroy() {
    if (this.needSessionDestroy) {
      this.storageService.removeSessionData('CAROUSEL_INPUT');
    }
  }

}
