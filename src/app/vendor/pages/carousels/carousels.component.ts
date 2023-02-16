import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {NgxSpinnerService} from 'ngx-spinner';
import {UiService} from "../../../services/core/ui.service";
import {Carousel} from "../../../interfaces/common/carousel.interface";
import {ConfirmDialogComponent} from "../../../shared/components/ui/confirm-dialog/confirm-dialog.component";
import {CustomizationService} from "../../../services/common/customization.service";
import {FileUploadService} from "../../../services/gallery/file-upload.service";
import {ReloadService} from "../../../services/core/reload.service";

@Component({
  selector: 'app-carousels',
  templateUrl: './carousels.component.html',
  styleUrls: ['./carousels.component.scss']
})
export class CarouselsComponent implements OnInit {

  carousels: Carousel[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private customizationService: CustomizationService,
    private fileUploadService: FileUploadService,
    private uiService: UiService,
    private dialog: MatDialog,
    private reloadService: ReloadService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshCarousel$.subscribe(() => {
      this.getAllCarousel();
    });

    this.getAllCarousel();
  }


  /**
   * CONFIRM DIALOG
   */
  public openConfirmDialog(carousel: Carousel) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this carousel?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteCarouselById(carousel._id);
      }
    });
  }


  /**
   * HTTP REQ HANDLE
   */

  private getAllCarousel() {
    this.spinner.show();
    this.customizationService.getAllCarousel()
      .subscribe(res => {
        this.carousels = res.data;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  private deleteCarouselById(id: string) {
    this.spinner.show();
    this.customizationService.deleteCarouselById(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshCarousel$();
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

}
