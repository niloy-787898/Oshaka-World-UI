import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SellOnRoutingModule } from './sell-on-routing.module';
import { SellOnComponent } from './sell-on.component';
import { VendorRegistrationComponent } from './vendor-registration/vendor-registration.component';
import {ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MaterialModule} from '../../material/material.module';
import {NgxSpinnerModule} from 'ngx-spinner';
import {SwiperModule} from 'swiper/angular';
// import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';



@NgModule({
  declarations: [
    SellOnComponent,
    VendorRegistrationComponent
  ],
  imports: [
    CommonModule,
    SellOnRoutingModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    NgxSpinnerModule,
    SwiperModule,
    // MatDialogModule



  ],

})
export class SellOnModule { }
