import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorIdentificationRoutingModule } from './vendor-identification-routing.module';
import { VendorIdentificationComponent } from './vendor-identification.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../../shared/shared.module';
import {MaterialModule} from '../../../material/material.module';


@NgModule({
  declarations: [
    VendorIdentificationComponent
  ],
  imports: [
    CommonModule,
    VendorIdentificationRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule
  ]
})
export class VendorIdentificationModule { }
