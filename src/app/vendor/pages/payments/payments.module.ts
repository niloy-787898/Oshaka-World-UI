import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentsRoutingModule } from './payments-routing.module';
import { PaymentsComponent } from './payments.component';
import {MaterialModule} from '../../../material/material.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgxSpinnerModule} from 'ngx-spinner';
import {FlexModule} from '@angular/flex-layout';
import {PipesModule} from '../../../shared/pipes/pipes.module';



@NgModule({
  declarations: [
    PaymentsComponent
  ],
  imports: [
    CommonModule,
    PaymentsRoutingModule,
    MaterialModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    PipesModule,
    FlexModule
  ]
})
export class PaymentsModule { }
