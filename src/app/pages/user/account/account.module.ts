import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AccountRoutingModule} from './account-routing.module';
import {AccountComponent} from './account.component';
import {MaterialModule} from '../../../material/material.module';
import {SharedModule} from '../../../shared/shared.module';
import {BasicInfoComponent} from './basic-info/basic-info.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {AddressBookComponent} from './address-book/address-book.component';
import {OrderListComponent} from './order-list/order-list.component';
import {ReviewsComponent} from './reviews/reviews.component';
import {TransactionsComponent} from './transactions/transactions.component';
import {EditBasicInfoModule} from '../../../shared/dialog-view/edit-basic-info/edit-basic-info.module';
import {EditAddressBookModule} from '../../../shared/dialog-view/edit-address-book/edit-address-book.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {OrderDetailsComponent} from './order-details/order-details.component';
import {ImageCropComponent} from './image-crop/image-crop.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ImageCropperModule} from 'ngx-image-cropper';
import {OrderTimelineComponent} from './order-timeline/order-timeline.component';
import {WishlistComponent} from './wishlist/wishlist.component';
import {PipesModule} from '../../../shared/pipes/pipes.module';
import {NgxSpinnerModule} from 'ngx-spinner';
import {OrderTimelineModule} from '../../../shared/lazy-component/order-timeline/order-timeline.module';


@NgModule({
  declarations: [
    AccountComponent,
    BasicInfoComponent,
    ChangePasswordComponent,
    AddressBookComponent,
    OrderListComponent,
    ReviewsComponent,
    TransactionsComponent,
    OrderDetailsComponent,
    ImageCropComponent,
    OrderTimelineComponent,
    WishlistComponent,
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    MaterialModule,
    SharedModule,
    EditBasicInfoModule,
    EditAddressBookModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatProgressSpinnerModule,
    ImageCropperModule,
    FormsModule,
    PipesModule,
    NgxSpinnerModule,
    OrderTimelineModule

  ]
})
export class AccountModule {
}
