import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SellOnComponent} from './sell-on.component';
import {VendorRegistrationComponent} from './vendor-registration/vendor-registration.component';

const routes: Routes = [
  {path: '', component: SellOnComponent},
  {path: 'registration', component: VendorRegistrationComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellOnRoutingModule { }
