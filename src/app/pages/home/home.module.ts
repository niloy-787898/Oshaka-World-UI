import { FeatureCardModule } from './../../shared/lazy-component/feature-card/feature-card.module';
import { BlogCardModule } from './../../shared/lazy-component/blog-card/blog-card.module';
import { ProductCardOneModule } from './../../shared/lazy-component/product-card-one/product-card-one.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { SwiperModule } from 'swiper/angular';
import { MaterialModule } from './../../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import {SharedModule} from '../../shared/shared.module';
import {BrandCardOneModule} from '../../shared/lazy-component/brand-card-one/brand-card-one.module';
import {CategoryCardOneModule} from '../../shared/lazy-component/category-card-one/category-card-one.module';
import {ProductCarOneLoaderModule} from '../../shared/loader/product-car-one-loader/product-car-one-loader.module';
import {CategoryMenuLoaderModule} from '../../shared/loader/category-menu-loader/category-menu-loader.module';
import {TimeCounterOneModule} from '../../shared/lazy-component/time-counter-one/time-counter-one.module';
import {ProductCardTwoModule} from "../../shared/lazy-component/product-card-two/product-card-two.module";


@NgModule({
  declarations: [
    HomeComponent
  ],
    imports: [
        CommonModule,
        HomeRoutingModule,
        MaterialModule,
        SwiperModule,
        SlickCarouselModule,
        ProductCardOneModule,
        BlogCardModule,
        FeatureCardModule,
        SharedModule,
        BrandCardOneModule,
        CategoryCardOneModule,
        ProductCarOneLoaderModule,
        CategoryMenuLoaderModule,
        TimeCounterOneModule,
        ProductCardTwoModule
    ]
})
export class HomeModule { }
