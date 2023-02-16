import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandsRoutingModule } from './brands-routing.module';
import { BrandsComponent } from './brands.component';
import {MaterialModule} from '../../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexModule} from '@angular/flex-layout';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {NgxSpinnerModule} from 'ngx-spinner';


@NgModule({
  declarations: [
    BrandsComponent
  ],
    imports: [
        CommonModule,
        BrandsRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        FlexModule,
        FormsModule,
        MatProgressSpinnerModule,
        NgxSpinnerModule,
    ]
})
export class BrandsModule { }
