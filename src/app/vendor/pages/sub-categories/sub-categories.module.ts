import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubCategoriesRoutingModule } from './sub-categories-routing.module';
import { SubCategoriesComponent } from './sub-categories.component';
import {MaterialModule} from '../../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FlexLayoutModule} from '@angular/flex-layout';


@NgModule({
  declarations: [
    SubCategoriesComponent,
  ],
  imports: [
    CommonModule,
    SubCategoriesRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    FlexLayoutModule
  ]
})
export class SubCategoriesModule { }
