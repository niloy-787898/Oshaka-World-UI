import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ImageCropComponent} from './image-crop/image-crop.component';
import {BreakpointObserver} from '@angular/cdk/layout';
import {Observable, Subscription} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {UserService} from '../../../services/common/user.service';
import {UserDataService} from '../../../services/common/user-data.service';
import {User} from '../../../interfaces/common/user.interface';
import {ReloadService} from '../../../services/core/reload.service';
import {FileUploadService} from '../../../services/gallery/file-upload.service';
import {FileData} from '../../../interfaces/gallery/file-data';
import {UiService} from '../../../services/core/ui.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {

  user: User = null;

  // Image Upload
  imageChangedEvent: any = null;
  imgPlaceHolder = '/assets/svg/user.svg';

  pickedImage?: any;
  file: any = null;
  newFileName: string;

  imgBlob: any = null;

  // BREAKPOINTS
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(['(max-width: 599px)'])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  // Subscriptions
  private subReloadOne: Subscription;
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;


  constructor(
    protected userDataService: UserDataService,
    private userService: UserService,
    private reloadService: ReloadService,
    private dialog: MatDialog,
    private fileUploadService: FileUploadService,
    private uiService: UiService,
    private breakpointObserver: BreakpointObserver,
  ) {
  }

  ngOnInit(): void {
    this.subReloadOne = this.reloadService.refreshData$.subscribe(() => {
      this.getLoggedInUserInfo();
    });
    this.getLoggedInUserInfo();
  }

  /**
   * HTTP REQ HANDLE
   * getLoggedInUserInfo()
   * updateLoggedInUserInfo()
   * imageUploadOnServer()
   * removeOldImageFromServer()
   */

  private getLoggedInUserInfo() {
    const select = 'username phoneNo name profileImg';
    this.subDataOne = this.userDataService.getLoggedInUserData(select)
      .subscribe(res => {
        this.user = res.data;
        if (this.user.profileImg) {
          this.imgPlaceHolder = this.user.profileImg;
        }
      }, error => {
        console.log(error);
      });
  }

  updateLoggedInUserInfo(data: any) {
    this.subDataTwo = this.userDataService.updateLoggedInUserInfo(data)
      .subscribe((res) => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshData$();
      }, error => {
        console.log(error);
      });
  }

  private imageUploadOnServer() {
    const data: FileData = {
      fileName: this.newFileName,
      file: this.imgBlob,
      folderPath: 'admins'
    };
    this.subDataThree = this.fileUploadService.uploadSingleImage(data)
      .subscribe(res => {
        this.removeImageFiles();
        if (this.user.profileImg) {
          this.removeOldImageFromServer(this.user.profileImg);
        }
        this.updateLoggedInUserInfo({profileImg: res.downloadUrl});
      }, error => {
        console.log(error);
      });
  }

  private removeOldImageFromServer(imgUrl: string) {
    this.subDataFour = this.fileUploadService.removeSingleFile(imgUrl)
      .subscribe(res => {
        console.log(res.message);
      }, error => {
        console.log(error);
      });
  }


  /**
   * ON IMAGE PICK
   * fileChangeEvent()
   * removeImageFiles()
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
      this.imgPlaceHolder = reader.result as string;
    };

    // Open Upload Dialog
    if (event.target.files[0]) {
      this.openComponentDialog(event);
    }

    // NGX Image Cropper Event..
    this.imageChangedEvent = event;
  }

  private removeImageFiles() {
    this.file = null;
    this.newFileName = null;
    this.pickedImage = null;
    this.imgBlob = null;
  }


  /**
   * OPEN COMPONENT DIALOG
   * openComponentDialog()
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
            console.log(this.pickedImage)
            this.imageUploadOnServer();
          }
        }
      }
    });
  }


  onLogout() {
    this.userService.userLogOut();
  }


  onLinkChange() {
    this.isHandset$.subscribe((isHandset) => {
      if (isHandset) {
        const element = document.getElementById('main-sidebar-container-area');
        setTimeout(() => {
          window.scrollTo({
            left: 0,
            top: element.scrollHeight,
            behavior: 'smooth'
          });
        }, 150);
      }
    });
  }

  /**
   * ON DESTROY
   */
  ngOnDestroy() {
    if (this.subReloadOne) {
      this.subReloadOne.unsubscribe();
    }

    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }

    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }

    if (this.subDataThree) {
      this.subDataThree.unsubscribe();
    }

    if (this.subDataFour) {
      this.subDataFour.unsubscribe();
    }
  }

}
