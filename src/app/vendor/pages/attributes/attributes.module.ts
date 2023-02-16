import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttributesRoutingModule } from './attributes-routing.module';
import { AttributesComponent } from './attributes.component';
import {MaterialModule} from '../../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {NgxSpinnerModule} from 'ngx-spinner';
import {BreadcrumbSoftModule} from "../../../shared/lazy-component/breadcrumb-soft/breadcrumb-soft.module";



@NgModule({
  declarations: [
    AttributesComponent
  ],
    imports: [
        CommonModule,
        AttributesRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        FormsModule,
        MatProgressSpinnerModule,
        BreadcrumbSoftModule,
        NgxSpinnerModule,
    ]
})
export class AttributesModule { }
