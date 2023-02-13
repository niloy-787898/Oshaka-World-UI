import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PcBuildComponent} from './pc-build.component';
import {ChooseProductComponent} from './choose-product/choose-product.component';

const routes: Routes = [
  {
    path: '',
    component: PcBuildComponent
  },
  {
    path: 'choose/:id/:componentTag/:componentCatSlug',
    component: ChooseProductComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PcBuildRoutingModule { }
