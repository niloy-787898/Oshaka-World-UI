import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import {FlexModule} from '@angular/flex-layout';
import {MaterialModule} from '../../../material/material.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgxSpinnerModule} from 'ngx-spinner';
import {NgxPrintModule} from 'ngx-print';
import { UpdateOrderStatusComponent } from './update-order-status/update-order-status.component';
import {PipesModule} from '../../../shared/pipes/pipes.module';
import { OrderDetailsComponent } from './order-details/order-details.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PrintInvoiceComponent } from './order-details/print-invoice/print-invoice.component';

@NgModule({
  declarations: [
    OrdersComponent,
    UpdateOrderStatusComponent,
    PrintInvoiceComponent,
    OrderDetailsComponent
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    FlexModule,
    MaterialModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    PipesModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPrintModule
  ]
})
export class OrdersModule { }
