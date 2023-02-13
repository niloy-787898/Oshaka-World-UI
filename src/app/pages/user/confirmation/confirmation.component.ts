import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {


  // Subscriptions
  private subRouteOne: Subscription;
  orderId: string;
  constructor(
    private activatedRouteService: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {

    // this.subRouteOne = this.activatedRouteService.queryParams.subscribe(qParam=>{
    //   if(qParam && qParam['orderId']){
    //     this.orderId = qParam['orderId'];
    //   }
    // })

    this.orderId =  localStorage.getItem("orderId");
    localStorage.removeItem("orderId");
  }

}
