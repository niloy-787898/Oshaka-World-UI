import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AddAddressComponent} from './add-address.component';
import {MatDialogModule} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {DigitOnlyModule} from '@uiowa/digit-only';



@NgModule({
  declarations: [
    AddAddressComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    DigitOnlyModule,
    FormsModule
  ],
  exports: [
    AddAddressComponent
  ]
})
export class AddAddressModule { }
