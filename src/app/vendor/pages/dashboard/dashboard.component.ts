import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  constructor(
    private router: Router
  ) {
  }

  ngOnInit() {
    // this.countsCollectionsDocuments();
  }


  /**
   * HTTP REQ HANDLE
   */

  // private countsCollectionsDocuments() {
  //   this.dataService.countsCollectionsDocuments()
  //     .subscribe(res => {
  //       this.counts = res.data;
  //     }, error => {
  //       console.log(error);
  //     });
  // }

  /**
   * HTTP Requested Data
   */

}
