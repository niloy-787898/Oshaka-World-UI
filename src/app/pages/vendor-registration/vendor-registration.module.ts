import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorRegistrationRoutingModule } from './vendor-registration-routing.module';
import { VendorRegistrationComponent } from './vendor-registration.component';
import { StepOneComponent } from './step-one/step-one.component';
import { StepTwoComponent } from './step-two/step-two.component';
import {SharedModule} from '../../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../material/material.module';
import {ImageCropperModule} from 'ngx-image-cropper';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FlexLayoutModule} from "@angular/flex-layout";


@NgModule({
  declarations: [
    VendorRegistrationComponent,
    StepOneComponent,
    StepTwoComponent
  ],
  imports: [
    CommonModule,
    VendorRegistrationRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MaterialModule,
    ImageCropperModule,
    MatProgressSpinnerModule,
    FlexLayoutModule
  ]
})
export class VendorRegistrationModule { }
