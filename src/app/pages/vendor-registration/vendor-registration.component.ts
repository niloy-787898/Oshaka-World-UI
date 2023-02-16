import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vendor-registration',
  templateUrl: './vendor-registration.component.html',
  styleUrls: ['./vendor-registration.component.scss']
})
export class VendorRegistrationComponent implements OnInit {

  isFirstStepDone = false;

  constructor() { }

  ngOnInit(): void {
  }

  onFirstStepDone() {
    this.isFirstStepDone = true;
  }

}
