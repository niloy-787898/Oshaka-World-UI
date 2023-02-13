import {Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-add-new-adress',
  templateUrl: './add-new-adress.component.html',
  styleUrls: ['./add-new-adress.component.scss']
})
export class AddNewAdressComponent implements OnInit {


  pupUp = false;


  constructor() {
  }

  ngOnInit(): void {

  }


  showPopUp() {
    this.pupUp = true;
  }

  hidePopUp() {
    this.pupUp = false;
  }


}
