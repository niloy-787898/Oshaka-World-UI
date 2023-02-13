import { SwiperModule } from 'swiper/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailsRoutingModule } from './product-details-routing.module';
import { PromoOfferProductDetailsComponent } from './promo-offer-product-details.component';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {ProductCarOneLoaderModule} from '../../shared/loader/product-car-one-loader/product-car-one-loader.module';
import {RatingAndReviewComponent} from './rating-and-review/rating-and-review.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StarRatingModule} from '../../shared/lazy-component/star-rating/star-rating.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {ProductCardOneModule} from '../../shared/lazy-component/product-card-one/product-card-one.module';
import {SharedModule} from '../../shared/shared.module';



@NgModule({
  declarations: [
    PromoOfferProductDetailsComponent,
    RatingAndReviewComponent
  ],
  imports: [
    CommonModule,
    ProductDetailsRoutingModule,
    ProductCardOneModule,
    SwiperModule,
    PipesModule,
    ProductCarOneLoaderModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    StarRatingModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatButtonModule,
    SharedModule,
  ]
})
export class PromoOfferProductDetailsModule { }
