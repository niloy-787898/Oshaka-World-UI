import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {ProductViewTableOneComponent} from '../components/product-view-table-one/product-view-table-one.component';
import {UiService} from "../../../services/core/ui.service";
import {BannerService} from "../../../services/common/banner.service";
import {Banner} from "../../../services/common/banner";
import {Product} from "../../../interfaces/common/product.interface";
import {ReloadService} from "../../../services/core/reload.service";

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

  allBanner: Banner[] = [];

  constructor(
    private dialog: MatDialog,
    private bannerService: BannerService,
    private uiService: UiService,
    private reloadService: ReloadService,
  ) { }

  ngOnInit(): void {
    this.reloadService.refreshBanner$.subscribe(() => {
      this.getAllBanner();
    });
    this.getAllBanner();
  }

  /**
   * COMPONENT DIALOG VIEW
   */
  public openConfirmDialog(id?: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this category?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteBannerById(id);
      }
    });
  }

  /**
   * OPEN COMPONENT DIALOG
   */

  public openComponentDialog(products: Product[]) {
    console.log(products);
    const dialogRef = this.dialog.open(ProductViewTableOneComponent, {
      data: products,
      panelClass: ['theme-dialog', 'full-screen-modal'],
      width: '100%',
      autoFocus: false,
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        // TODO IF CLOSE
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAllBanner() {
    this.bannerService.getAllBanner()
      .subscribe(res => {
        this.allBanner = res.data;
      }, error => {
        console.log(error);
      });
  }

  private deleteBannerById(id: string) {
    this.bannerService.deleteBannerById(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshBanner$();
      }, error => {
        console.log(error);
      });
  }
}
