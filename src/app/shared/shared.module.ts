import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SnackbarNotificationComponent} from './components/ui/snackbar-notification/snackbar-notification.component';
import {MessageDialogComponent} from './components/ui/message-dialog/message-dialog.component';
import {ConfirmDialogComponent} from './components/ui/confirm-dialog/confirm-dialog.component';
import {BottomSheetViewComponent} from './components/ui/bottom-sheet-view/bottom-sheet-view.component';
import {MaterialModule} from '../material/material.module';
import {FormsModule} from '@angular/forms';
import {
  ConfirmDialogWithCheckComponent
} from './components/ui/confirm-dialog-with-check/confirm-dialog-with-check.component';
import {OutSideClickDirective} from './directives/out-side-click.directive';
import {ImageLoadErrorDirective} from './directives/image-load-error.directive';
import {NgModelChangeDebouncedDirective} from './directives/ng-model-change.directive';
import {ImageProfileErrorDirective} from './directives/image-profile-error.directive';
import {MatIconModule} from "@angular/material/icon";


@NgModule({
  declarations: [
    SnackbarNotificationComponent,
    MessageDialogComponent,
    ConfirmDialogComponent,
    ConfirmDialogWithCheckComponent,
    BottomSheetViewComponent,
    OutSideClickDirective,
    ImageLoadErrorDirective,
    ImageProfileErrorDirective,
    NgModelChangeDebouncedDirective
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    MatIconModule,
  ],
  exports: [
    SnackbarNotificationComponent,
    MessageDialogComponent,
    ConfirmDialogComponent,
    BottomSheetViewComponent,
    OutSideClickDirective,
    ImageLoadErrorDirective,
    ImageProfileErrorDirective,
    NgModelChangeDebouncedDirective
  ],
  providers: []
})
export class SharedModule {
}
