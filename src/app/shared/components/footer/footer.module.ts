import { SwiperModule } from 'swiper/angular';
import { MaterialModule } from './../../../material/material.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared.module';



@NgModule({
  declarations: [
    FooterComponent
  ],
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        SwiperModule,
        ReactiveFormsModule,
        SharedModule
    ],
  exports:[
    FooterComponent
  ]
})
export class FooterModule { }
