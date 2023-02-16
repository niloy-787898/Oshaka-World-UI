import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {VendorIdentificationComponent} from './vendor-identification.component';

const routes: Routes = [
  {path: '', component: VendorIdentificationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorIdentificationRoutingModule { }
