import {OffersComponent} from './offers.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OfferDetailsComponent} from './offer-details/offer-details.component';

const routes: Routes = [
  {
    path: '',
    component: OffersComponent
  },
  {
    path: ':id',
    component: OfferDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OffersRoutingModule {
}
