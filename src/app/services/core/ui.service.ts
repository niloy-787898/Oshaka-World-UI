import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackbarNotificationComponent} from '../../shared/components/ui/snackbar-notification/snackbar-notification.component';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {BottomSheetViewComponent} from '../../shared/components/ui/bottom-sheet-view/bottom-sheet-view.component';
import {Router} from '@angular/router';
import {Cart} from "../../interfaces/common/cart.interface";
import {MatDialog} from "@angular/material/dialog";
import {CartViewDialogComponent} from "../../shared/components/cart-view-dialog/cart-view-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor(
    public snackBar: MatSnackBar,
    private bottomSheet: MatBottomSheet,
    private router: Router,
    public dialog: MatDialog,
  ) {
  }


  /**
   * SNACKBAR
   */
  success(msg) {
    this.snackBar.openFromComponent(SnackbarNotificationComponent, {
      data: msg,
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['notification', 'success-new']
    });
  }

  warn(msg) {
    this.snackBar.openFromComponent(SnackbarNotificationComponent, {
      data: msg,
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['notification', 'warn']
    });
  }

  wrong(msg) {
    this.snackBar.openFromComponent(SnackbarNotificationComponent, {
      data: msg,
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['notification', 'wrong']
    });
  }


  /**
   * OPEN BOTTOM SHEET
   */
  bottomSheetPrimary(data: { message: string; btnName?: string; routerLink?: string; timeOut?: number }) {
    const sheetRef = this.bottomSheet.open(BottomSheetViewComponent, {
      panelClass: ['bottom-sheet-primary', 'primary'],
      data
    });
  }

  bottomSheetSuccess(data: { message: string; btnName?: string; routerLink?: string; timeOut?: number }) {
    const sheetRef = this.bottomSheet.open(BottomSheetViewComponent, {
      panelClass: ['bottom-sheet-primary', 'success'],
      data
    });
    sheetRef.afterDismissed().subscribe(comData => {
      if (comData.routerLink) {
        this.router.navigate([comData.routerLink]);
      }
    });
  }

  /**
   * ADDITIONAL DIALOG
   */
  openCartViewDialog(data: Cart[]) {
    this.dialog.open(CartViewDialogComponent, {
      data,
      width: '90%',
      maxWidth: '1050px',
      disableClose: true
    });
  }


}
