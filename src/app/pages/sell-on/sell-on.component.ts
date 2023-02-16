import { Component, OnInit } from '@angular/core';
import SwiperCore, {Navigation} from 'swiper';
import {CarouselCtrService} from "../../services/common/carousel-ctr.service";

// install Swiper modules
SwiperCore.use([Navigation]);

@Component({
  selector: 'app-sell-on',
  templateUrl: './sell-on.component.html',
  styleUrls: ['./sell-on.component.scss']
})
export class SellOnComponent implements OnInit {

  constructor(
    public carouselCtrService: CarouselCtrService
  ) { }

  ngOnInit(): void {
  }

}
