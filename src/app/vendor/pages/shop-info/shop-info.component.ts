import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {NgxSpinnerService} from 'ngx-spinner';

import {ImageCropComponent} from '../../../pages/user/account/image-crop/image-crop.component';

import {MatDialog} from '@angular/material/dialog';
import {Vendor} from "../../../interfaces/common/vendor";
import {UiService} from "../../../services/core/ui.service";
import {TagService} from "../../../services/common/tag.service";
import {VendorDataService} from "../../../services/common/vendor-data.service";
import {UtilsService} from "../../../services/core/utils.service";
import {FileUploadService} from "../../../services/gallery/file-upload.service";
import {ShopService} from "../../../services/common/shop.service";
import {FileData} from "../../../interfaces/gallery/file-data";


@Component({
  selector: 'app-footer-info',
  templateUrl: './shop-info.component.html',
  styleUrls: ['./shop-info.component.scss']
})
export class ShopInfoComponent implements OnInit {


  dataForm?: FormGroup;
  vendor?: Vendor;

  // Image Holder
  placeholder = '/assets/images/placeholder/test.png';
  // Image Upload
  imageChangedEvent: any = null;
  staticImage = '/assets/svg/user.svg';
  imgPlaceHolder = '/assets/svg/user.svg';

  pickedImage?: any;
  file: any = null;
  newFileName: string;

  imgBlob: any = null;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private tagService: TagService,
    public router: Router,
    private shopService: ShopService,
    private spinner: NgxSpinnerService,
    private venodrDataService: VendorDataService,
    private utilsService: UtilsService,
    private dialog: MatDialog,
    private fileUploadService: FileUploadService,
  ) {
  }

  ngOnInit(): void {

    // GET DATA
    this.getLoginVendorInfo();

    // INIT FORM
    this.initFormGroup();

  }

  /**
   * INIT FORM
   */
  private initFormGroup() {

    this.dataForm = this.fb.group({
      email: [null],
      shopName: [null, Validators.required],
      shopArea: [null],
      shopZone: [null],
      address: [null, Validators.required],
      shortDescription: [null],
      termsAndConditions: [null],
      shopLogo: [null],
    });

  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }
    this.vendor.email = this.dataForm.value.email;
    this.vendor.shopName = this.dataForm.value.shopName;
    this.vendor.shopSlug = this.utilsService.convertStringToSlug(this.dataForm.value.shopName);
    this.vendor.shopArea = this.dataForm.value.shopArea;
    this.vendor.shopZone = this.dataForm.value.shopZone;
    this.vendor.address = this.dataForm.value.address;
    this.vendor.shortDescription = this.dataForm.value.shortDescription;
    this.vendor.termsAndConditions = this.dataForm.value.termsAndConditions;

    this.editVendorOwnProfileInfo(this.vendor);
  }

  /**
   * HTTP REQ HANDLE
   */

  private getLoginVendorInfo() {
    this.venodrDataService.getLoginVendorInfo()
    .subscribe( req => {
      this.vendor = req.data;
      if (this.vendor && this.vendor.shopLogo) {
        this.placeholder = this.vendor.shopLogo;
      }
      this.dataForm.patchValue(this.vendor);
    }, err => {
      console.log(err);
    });
  }

  private editVendorOwnProfileInfo(data: any) {
    this.venodrDataService.editVendorOwnProfileInfo(data)
    .subscribe( req => {
      this.uiService.success(req.message);
    }, err => {
      console.log(err);
    });
  }


  /**
   * ON IMAGE PICK
   */

  fileChangeEvent(event: any) {
    this.file = (event.target as HTMLInputElement).files[0];
    // File Name Modify...
    const originalNameWithoutExt = this.file.name.toLowerCase().split(' ').join('-').split('.').shift();
    const fileExtension = this.file.name.split('.').pop();
    // Generate new File Name..
    this.newFileName = `${Date.now().toString()}_${originalNameWithoutExt}.${fileExtension}`;

    const reader = new FileReader();
    reader.readAsDataURL(this.file);

    reader.onload = () => {
      // this.imgPlaceHolder = reader.result as string;
    };

    // Open Upload Dialog
    if (event.target.files[0]) {
      this.openComponentDialog(event);
    }

    // NGX Image Cropper Event..
    this.imageChangedEvent = event;
  }


  /**
   * OPEN COMPONENT DIALOG
   */
  public openComponentDialog(data?: any) {
    const dialogRef = this.dialog.open(ImageCropComponent, {
      data,
      panelClass: ['theme-dialog'],
      autoFocus: false,
      disableClose: true,
      width: '680px',
      minHeight: '400px',
      maxHeight: '600px'
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.imgBlob) {
          this.imgBlob = dialogResult.imgBlob;
        }
        if (dialogResult.croppedImage) {
          this.pickedImage = dialogResult.croppedImage;
          this.imgPlaceHolder = this.pickedImage;

          if (this.pickedImage) {
            this.imageUploadOnServer();
          }
        }
      }
    });
  }

  /**
   * IMAGE UPLOAD HTTP REQ HANDLE
   */

  imageUploadOnServer() {
    const data: FileData = {
      fileName: this.newFileName,
      file: this.imgBlob,
      folderPath: 'vendors'
    };
    this.fileUploadService.uploadSingleImage(data)
      .subscribe(res => {
        this.removeImageFiles();
        const url = res.url;
        this.placeholder = url;
        console.log(url)
        if (this.vendor.shopLogo) {
          this.removeOldImageFromServer(this.vendor.shopLogo)
        }
        this.editVendorOwnProfileInfo({shopLogo: url})
        this.dataForm.patchValue({shopLogo: url});
      }, error => {
        console.log(error);
      });
  }

  /**
   * REMOVE IMAGE STORE DATA
   */
  removeOldImageFromServer(imgUrl: string) {
    this.fileUploadService.removeSingleFile(imgUrl)
      .subscribe(res => {
        console.log(res.message);
      }, error => {
        console.log(error);
      });
  }

  private removeImageFiles() {
    this.file = null;
    this.newFileName = null;
    this.pickedImage = null;
    this.imgBlob = null;
  }


}
