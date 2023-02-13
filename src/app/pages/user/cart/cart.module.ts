import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CartRoutingModule} from './cart-routing.module';
import {CartComponent} from './cart.component';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../../../shared/shared.module';
import {PipesModule} from '../../../shared/pipes/pipes.module';
import {MatCheckboxModule} from '@angular/material/checkbox';


@NgModule({
  declarations: [
    CartComponent
  ],
  imports: [
    CommonModule,
    CartRoutingModule,
    RouterModule,
    FormsModule,
    SharedModule,
    PipesModule,
    MatCheckboxModule
  ]
})
export class CartModule { }
