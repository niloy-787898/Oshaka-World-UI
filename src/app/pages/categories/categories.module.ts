import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './categories.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {CategoryCardOneModule} from '../../shared/lazy-component/category-card-one/category-card-one.module';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    CategoriesComponent
  ],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    NgxPaginationModule,
    CategoryCardOneModule,
    FormsModule
  ]
})
export class CategoriesModule { }
