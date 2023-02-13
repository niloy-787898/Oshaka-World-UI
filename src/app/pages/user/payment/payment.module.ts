import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentComponent } from './payment.component';
import {PipesModule} from '../../../shared/pipes/pipes.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from "../../../shared/shared.module";


@NgModule({
  declarations: [
    PaymentComponent
  ],
  imports: [
    CommonModule,
    PaymentRoutingModule,
    MaterialModule,
    RouterModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class PaymentModule { }
