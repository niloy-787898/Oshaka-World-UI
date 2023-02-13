import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PcBuildRoutingModule } from './pc-build-routing.module';
import { PcBuildComponent } from './pc-build.component';
import { ChooseProductComponent } from './choose-product/choose-product.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSliderModule} from '@angular/material/slider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {NgxPaginationModule} from 'ngx-pagination';
import {SharedModule} from '../../shared/shared.module';
import { NgxPrintModule } from 'ngx-print';

@NgModule({
  declarations: [
    PcBuildComponent,
    ChooseProductComponent
  ],
  imports: [
    CommonModule,
    PcBuildRoutingModule,
    NgxSpinnerModule,
    MatPaginatorModule,
    MatIconModule,
    MatCardModule,
    MatExpansionModule,
    MatSliderModule,
    MatCheckboxModule,
    FormsModule,
    MatButtonModule,
    NgxPaginationModule,
    SharedModule,
    NgxPrintModule,
  ]
})
export class PcBuildModule { }
