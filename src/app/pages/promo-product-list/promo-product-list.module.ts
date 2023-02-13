import { SwiperModule } from 'swiper/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromoProductListRoutingModule } from './promo-product-list-routing.module';
import { PromoProductListComponent } from './promo-product-list.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import {NgxPaginationModule} from 'ngx-pagination';
import {ProductCarOneLoaderModule} from '../../shared/loader/product-car-one-loader/product-car-one-loader.module';
import {FormsModule} from '@angular/forms';
import {FeatureCardModule} from '../../shared/lazy-component/feature-card/feature-card.module';
import {ProductCardOneModule} from '../../shared/lazy-component/product-card-one/product-card-one.module';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {TimeCounterOneModule} from '../../shared/lazy-component/time-counter-one/time-counter-one.module';
import { ProductCardTwoModule } from './../../shared/lazy-component/product-card-two/product-card-two.module';

@NgModule({
  declarations: [
    PromoProductListComponent
  ],
  imports: [
    CommonModule,
    PromoProductListRoutingModule,
    ProductCardOneModule,
    RouterModule,
    SwiperModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    ProductCarOneLoaderModule,
    FormsModule,
    FeatureCardModule,
    MatCheckboxModule,
    TimeCounterOneModule,
    ProductCardTwoModule
  ]
})
export class PromoProductListModule { }
