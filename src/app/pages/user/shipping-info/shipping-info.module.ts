import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShippingInfoRoutingModule } from './shipping-info-routing.module';
import { ShippingInfoComponent } from './shipping-info.component';
import {ReactiveFormsModule} from '@angular/forms';
import {AddAddressModule} from '../../../shared/dialog-view/add-address/add-address.module';


@NgModule({
  declarations: [
    ShippingInfoComponent,
  ],
  imports: [
    CommonModule,
    ShippingInfoRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    AddAddressModule
  ]
})
export class ShippingInfoModule { }
