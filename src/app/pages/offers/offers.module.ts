import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OffersRoutingModule } from './offers-routing.module';
import { OffersComponent } from './offers.component';
import {SharedModule} from '../../shared/shared.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgxSpinnerModule} from 'ngx-spinner';
import { OfferDetailsComponent } from './offer-details/offer-details.component';
import {PipesModule} from '../../shared/pipes/pipes.module';


@NgModule({
  declarations: [
    OffersComponent,
    OfferDetailsComponent
  ],
  imports: [
    CommonModule,
    OffersRoutingModule,
    SharedModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    PipesModule
  ]
})
export class OffersModule { }
