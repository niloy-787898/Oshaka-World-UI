import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { MatDialog } from '@angular/material/dialog';
import { ImageCropComponent } from '../profile/image-crop/image-crop.component';
import { Vendor } from "../../../interfaces/common/vendor";
import { Select } from "../../../interfaces/core/select";
import { UiService } from "../../../services/core/ui.service";
import { VendorIdentificationService } from "../../../services/common/vendor-identification.service";
import { StorageService } from "../../../services/core/storage.service";
import { TagService } from "../../../services/common/tag.service";
import { UtilsService } from "../../../services/core/utils.service";
import { VendorDataService } from "../../../services/common/vendor-data.service";
import { VendorService } from "../../../services/common/vendor.service";
import { ReloadService } from "../../../services/core/reload.service";
import { FileUploadService } from "../../../services/gallery/file-upload.service";
import { VendorIdentification } from "../../../interfaces/common/vendor-identification";
import { FileData } from "../../../interfaces/gallery/file-data";


let chooseImages = [];
@Component({
  selector: 'app-vendor-identification',
  templateUrl: './vendor-identification.component.html',
  styleUrls: ['./vendor-identification.component.scss']
})
export class VendorIdentificationComponent implements OnInit {
  dataForm?: FormGroup;

  socialLinksArray?: FormArray;

  vendorIdentification: VendorIdentification;
  hasVendorIdentificationInfo: Boolean = false;

  isLoading = false;
  file: any = null;
  newFileName: string;
  // Store Data from param
  id?: string;
  vendorId: string;
  //vendor
  vendor: Vendor;
  idType: Select[] = [
    { value: 'nid-card', viewValue: 'NID Card - For little business holder' },
    { value: 'business-license-no', viewValue: 'Business Licence Number - For big business' },
  ];

  // Image Holder
  imgPlaceHolder = '/assets/svg/vendor.svg';
  imgPlaceHolder1 = '/assets/svg/vendor.svg';
  imgPlaceHolder2 = '/assets/svg/vendor.svg';
  imgPlaceHolder3 = '/assets/svg/vendor.svg';

  placeholder = '/assets/images/avatar/image-upload.jpg';
  tradeLicenseImage?: any;
  businessCardImage?: any;

  imageChangedEvent: any = null;
  imgBlob: any = null;
  nidCardImageFront?: any;
  nidCardImageBack?: any;
  // // Destroy Session
  needSessionDestroy = false;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private tagService: TagService,
    public router: Router,
    private vendorIdentificationService: VendorIdentificationService,
    private spinner: NgxSpinnerService,
    private storageService: StorageService,
    // public textEditorCtrService: TextEditorCtrService,
    private reloadService: ReloadService,
    private utilsService: UtilsService,
    private fileUploadService: FileUploadService,
    private vendorDataService: VendorDataService,
    private vendorService: VendorService
  ) { }

  ngOnInit(): void {

    // INIT FORM
    this.initFormGroup();

    // this.chooseNIDImage.push(this.placeholder);
    this.tradeLicenseImage = this.placeholder
    this.businessCardImage = this.placeholder
    // Image From state
    /* if (!this.id) {
      if (this.storageService.getStoredInput('VENDOR_IDENTIFICATION_INPUT')) {
        this.dataForm.patchValue(this.storageService.getStoredInput('VENDOR_IDENTIFICATION_INPUT'));
      }
     //console.log("beep Boop")
      /* if (history.state.images) {
         this.needSessionDestroy = true;
        chooseImages.push(history.state.images[0])
        //console.log(chooseImages) */
    // this.nidCardImageFront2 = history.state.images[1].url;
    /*  this.dataForm.patchValue(
       {nidCardImages: this.chooseNIDImage},
     );
     this.chooseNIDImage.push(chooseImages[0]?chooseImages[0].url:this.placeholder)
     this.chooseNIDImage.push(chooseImages[1]?chooseImages[1].url:this.placeholder)
     this.tradeLicenseImage=chooseImages[2]?chooseImages[2].url:this.placeholder
     this.businessCardImage=chooseImages[3]?chooseImages[3].url:this.placeholder
     // this.dataForm.patchValue(
     //   {idBackSide: this.nidCardImageFront2},
     // );
   //}

 } */

    // GET DATA
    this.getVendorIdentificationData();
    this.getVendorInfo();
  }

  /**
   * INIT FORM
   */
  private initFormGroup() {

    this.dataForm = this.fb.group({
      idType: [null],
      fullName: [null],
      nidCardNo: [null],
      nidCardImageFront: [null],
      nidCardImageBack: [null],
      businessCardNo: [null],
      businessCardImage: [null],
      tradeLicenseNo: [null],
      tradeLicenseImage: [null],

    });
  }

  // /**
  //  * SET FORM DATA
  //  */
  // private setFormData() {
  //   if (this.storageService.getStoredInput('VENDOR_IDENTIFICATION_INPUT')) {
  //     this.dataForm.patchValue(this.storageService.getStoredInput('VENDOR_IDENTIFICATION_INPUT'));
  //   }
  //   if (history.state.images) {
  //     this.needSessionDestroy = true;
  //     this.nidCardImageFront = history.state.images[0].url;
  //     this.dataForm.patchValue(
  //       {idFontSide: this.nidCardImageFront}
  //     );
  //   } else {
  //     this.nidCardImageFront = this.placeholder;
  //   }
  // }

  onHoldInputData(type: string) {

    this.needSessionDestroy = false;
    this.storageService.storeInputData(this.dataForm?.value, 'VENDOR_IDENTIFICATION_INPUT');

  }

  onSubmit() {
    //console.log('submit triggered')
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }
    //const nidImages=this.chooseNIDImage;
    ////console.log(this.dataForm.value);
    if (this.vendorIdentification) {
      //this.dataForm.value.nidCardImages=nidImages;
      this.dataForm.value.nidCardImageFront = this.nidCardImageFront;
      this.dataForm.value.nidCardImageBack = this.nidCardImageBack;
      this.dataForm.value.tradeLicenseImage = this.tradeLicenseImage;
      this.dataForm.value.businessCardImage = this.businessCardImage;

      //console.log(this.dataForm.value);
      const finalData = { ...this.dataForm.value };
      this.updateVendorIdentificationData(finalData);
    } else {
      this.dataForm.value.nidCardImageFront = this.nidCardImageFront;
      this.dataForm.value.nidCardImageBack = this.nidCardImageBack;
      this.dataForm.value.tradeLicenseImage = this.tradeLicenseImage;
      this.dataForm.value.businessCardImage = this.businessCardImage;
      const finalData = { ...this.dataForm.value };
      this.addVendorIdentificationData(this.dataForm.value);
    }

  }

  private addVendorIdentificationData(data: VendorIdentification) {
    this.spinner.show();
    //console.log(data);
    this.vendorIdentificationService.addVendorIdentificationData(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.spinner.hide();
        this.storageService.removeSessionData('VENDOR_IDENTIFICATION_INPUT');
        this.reloadService.needRefreshVendorIdentification$();
        // this.addIdentificationDataToVendor();
      }, err => {
        this.spinner.hide();
        //console.log(err);
      });
  }

  private getVendorIdentificationData() {
    this.spinner.show();
    this.vendorIdentificationService.getVendorIdentificationData()
      .subscribe(res => {
        ////console.log(res.data);
        this.spinner.hide();
        if (res.data) {
          this.vendorIdentification = res.data;
          console.log(this.vendorIdentification);

          //console.log(res.data);
          ////console.log(this.vendorIdentification);
          /*  this.chooseNIDImage = res.data?.nidCardImageFront; */
          // this.nidCardImageFront2 = res.data?.idBackSide;
          this.dataForm.patchValue(this.vendorIdentification);

          this.imgPlaceHolder = res.data.nidCardImageFront;
          this.imgPlaceHolder1 = res.data.nidCardImageBack;
          this.imgPlaceHolder2 = res.data.tradeLicenseImage;
          this.imgPlaceHolder3 = res.data.businessCardImage;

          this.hasVendorIdentificationInfo = true;
        }
        else {
          ////console.log("ELSE");
        }
      }, err => {
        this.spinner.hide();
        //console.log(err);
      });
  }

  private getVendorInfo() {
    this.vendorService.getLoggedInVendor().subscribe(res => {
      this.vendorId = res.data._id;
      this.vendor = res.data;
      ////console.log(res.data);

    })
  }

  private updateVendorIdentificationData(data: VendorIdentification) {
    this.spinner.show();
    //console.log(data);
    this.vendorIdentificationService.updateVendorIdentificationData(this.vendorIdentification._id,data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.storageService.removeSessionData('VENDOR_IDENTIFICATION_INPUT');
        this.reloadService.needRefreshVendorIdentification$();
        this.spinner.hide();

      }, err => {
        this.spinner.hide();
        //console.log(err);
      });
  }

  private addIdentificationDataToVendor() {
    this.vendor.vendorIdentification = this.id;
    //console.log(this.vendor)
  }
  /**
  * GET IMAGE DATA FROM STATE
  */


  fileChangeEvent(event: any, type?: string) {
    this.file = (event.target as HTMLInputElement).files[0];
    const originalNameWithoutExt = this.file.name.toLowerCase().split(' ').join('-').split('.').shift();
    const fileExtension = this.file.name.split('.').pop();
    this.newFileName = `${Date.now().toString()}_${originalNameWithoutExt}.${fileExtension}`;
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      let p = reader.result as string;
    };

    // Open Upload Dialog
    if (event.target.files[0]) {
      if (type == "nid1") {
        this.openComponentDialog(event);
      }
      else if (type == "nid2") {
        this.openComponentDialog1(event);
      }
      else if (type == "trade") {
        this.openComponentDialog2(event);
      }
      else if (type === 'business') {
        this.openComponentDialog3(event);
      }
    }

    // NGX Image Cropper Event..
    this.imageChangedEvent = event;
  }
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
      ////console.log(dialogResult);
      if (dialogResult) {
        if (dialogResult.imgBlob) {
          this.imgBlob = dialogResult.imgBlob;
        }
        if (dialogResult.croppedImage) {
          this.nidCardImageFront = dialogResult.croppedImage;
          this.imgPlaceHolder = this.nidCardImageFront;

          if (this.nidCardImageFront) {
            this.imageUploadOnServer("nidCardImageFront");
          }
        }
      }
    });
  }
  public openComponentDialog1(data?: any) {
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
          this.nidCardImageBack = dialogResult.croppedImage;
          this.imgPlaceHolder1 = this.nidCardImageBack;

          if (this.nidCardImageBack) {
            this.imageUploadOnServer("nidCardImageBack");
          }
        }
      }
    });
  }
  /*  */
  public openComponentDialog2(data?: any) {
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
          this.tradeLicenseImage = dialogResult.croppedImage;
          this.imgPlaceHolder2 = this.tradeLicenseImage;

          if (this.tradeLicenseImage) {
            //console.log("367")
            this.imageUploadOnServer("tradeLicenseImage");
          }
        }
      }
    });
  }
  /*  */
  public openComponentDialog3(data?: any) {
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
          this.businessCardImage = dialogResult.croppedImage;
          this.imgPlaceHolder3 = this.businessCardImage;

          if (this.businessCardImage) {
            this.imageUploadOnServer("businessCardImage");
          }
        }
      }
    });
  }
  imageUploadOnServer(imageName: string) {
    //console.log(this.newFileName);
    const data: FileData = {
      fileName: this.newFileName,
      file: this.imgBlob,
      folderPath: 'admins'
    };
    this.fileUploadService.uploadSingleImage(data)
      .subscribe(res => {
        // this.removeImageFiles();
        //console.log(res.url);
        if (this.hasVendorIdentificationInfo) {
          if (imageName === 'nidCardImageFront' && this.vendorIdentification.nidCardImageFront) {
            this.nidCardImageFront = res.url;
            this.removeOldImageFromServer(this.vendorIdentification.nidCardImageFront);
          }
          else if (imageName === 'nidCardImageBack' && this.vendorIdentification.nidCardImageBack) {
            this.nidCardImageBack = res.url;
            this.removeOldImageFromServer(this.vendorIdentification.nidCardImageBack);
          }
          else if (imageName === 'businessCardImage' && this.vendorIdentification.businessCardImage) {
            this.businessCardImage = res.url;
            this.removeOldImageFromServer(this.vendorIdentification.businessCardImage);
          }
          else if (imageName === 'tradeLicenseImage' && this.vendorIdentification.tradeLicenseImage) {
            this.tradeLicenseImage = res.url;
            this.removeOldImageFromServer(this.vendorIdentification.tradeLicenseImage);
          }


          if (imageName === 'nidCardImageFront') {
            this.nidCardImageFront = res.url;
            this.editLoggedInVendorData({ nidCardImageFront: res.url });
          }
          else if (imageName === 'nidCardImageBack') {
            this.nidCardImageBack = res.url;
            this.editLoggedInVendorData({ nidCardImageBack: res.url });
          }
          else if (imageName === 'businessCardImage') {
            this.businessCardImage = res.url;
            this.editLoggedInVendorData({ businessCardImage: res.url });
          }
          else if (imageName === 'tradeLicenseImage') {
            this.tradeLicenseImage = res.url;
            this.editLoggedInVendorData({ tradeLicenseImage: res.url });
          }
        }
        else {
          if (imageName === 'nidCardImageFront') {
            this.nidCardImageFront = res.url;
            // this.removeOldImageFromServer(this.vendorIdentification.nidCardImageFront);
          }
          else if (imageName === 'nidCardImageBack') {
            this.nidCardImageBack = res.url;
            // this.removeOldImageFromServer(this.vendorIdentification.nidCardImageBack);
          }
          else if (imageName === 'businessCardImage') {
            this.businessCardImage = res.url;
            //this.removeOldImageFromServer(this.vendorIdentification.businessCardImage);
          }
          else if (imageName === 'tradeLicenseImage') {
            //console.log("Trade ")
            //console.log(res.url);
            this.tradeLicenseImage = res.url;
            // this.removeOldImageFromServer(this.vendorIdentification.tradeLicenseImage);
          }
        }
      }, error => {
        //console.log(error);
      });
  }

  private removeImageFiles() {
    this.file = null;
    this.newFileName = null;
    this.nidCardImageFront = null;
    this.nidCardImageBack = null;
    this.businessCardImage = null;
    this.tradeLicenseImage = null;
    this.imgBlob = null;
  }

  removeOldImageFromServer(imgUrl: string) {
    this.fileUploadService.removeSingleFile(imgUrl)
      .subscribe(res => {
        //console.log(res.message);
      }, error => {
        //console.log(error);
      });
  }

  editLoggedInVendorData(data: any) {
    //console.log(data)
    this.vendorIdentificationService.updateVendorIdentificationData(this.vendorIdentification._id,data)
      .subscribe((res) => {
        ////console.log(res)
        this.uiService.success(res.message);
        this.reloadService.needRefreshVendors$();
      }, error => {
        //console.log(error);
      });
  }

}
