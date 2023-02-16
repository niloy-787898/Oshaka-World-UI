import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './dashboard.component';
import {RouterModule, Routes} from '@angular/router';
import {MaterialModule} from '../../../material/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {TilesComponent} from './tiles/tiles.component';
import {InfoCardsComponent} from './info-cards/info-cards.component';
import {MatIconModule} from "@angular/material/icon";
import {BarChartModule, LineChartModule} from "@swimlane/ngx-charts";


const routes: Routes = [
  {path: '', component: DashboardComponent}
];


@NgModule({
  declarations: [
    DashboardComponent,
    TilesComponent,
    InfoCardsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FlexLayoutModule,
    LineChartModule,
    BarChartModule,
    MatIconModule,
  ]
})
export class DashboardModule {
}
