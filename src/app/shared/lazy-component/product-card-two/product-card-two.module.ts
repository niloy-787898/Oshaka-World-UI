import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductCardTwoComponent} from './product-card-two.component';
import {PipesModule} from '../../pipes/pipes.module';
import {YoutubeVideoShowModule} from '../../dialog-view/youtube-video-show/youtube-video-show.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import {SharedModule} from '../../shared.module';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
  declarations: [
    ProductCardTwoComponent
  ],
    imports: [
        CommonModule,
        RouterModule,
        PipesModule,
        YoutubeVideoShowModule,
        MatTooltipModule,
        SharedModule,
        MatIconModule
    ],
  exports: [
    ProductCardTwoComponent
  ]
})
export class ProductCardTwoModule {
}
