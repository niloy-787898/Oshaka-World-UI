import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingComponent } from './star-rating.component';
import {MaterialModule} from '../../../material/material.module';
import {RatingAndReviewComponent} from '../../../pages/product-details/rating-and-review/rating-and-review.component';



@NgModule({
  declarations: [
    StarRatingComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    StarRatingComponent,
  ]
})
export class StarRatingModule { }
