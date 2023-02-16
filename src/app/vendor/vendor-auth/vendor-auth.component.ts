import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {Meta} from '@angular/platform-browser';
import {NgxSpinnerService} from 'ngx-spinner';
import {UiService} from "../../services/core/ui.service";
import {VendorService} from "../../services/common/vendor.service";


@Component({
  selector: 'app-admin-auth',
  templateUrl: './vendor-auth.component.html',
  styleUrls: ['./vendor-auth.component.scss']
})
export class VendorAuthComponent implements OnInit {
  // Reactive Form
  loginForm: FormGroup;
  vendorName = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);

  constructor(
    private uiService: UiService,
    private vendorService: VendorService,
    private meta: Meta,
    private spinner: NgxSpinnerService,
  ) {
    this.googleNoIndex();
  }

  ngOnInit(): void {
    // Main reactive form..
    this.loginForm = new FormGroup({
      vendorName: this.vendorName,
      password: this.password
    });

  }

  // Main Login Method..
  onLogin() {
    if (this.loginForm.invalid) {
      this.uiService.wrong('Invalid Input field!');
      return;
    }
    // Spinner..
    this.spinner.show();
    // Form Data..
    const vendorName = this.loginForm.value.vendorName.trim().toLowerCase();
    const password = this.loginForm.value.password;

    const data = {vendorName, password};


    this.vendorService.vendorLogin(data);
  }



  /**
   * SEO TITLE
   * SEO META TAGS
   */

  private googleNoIndex() {
    this.meta.updateTag({name: 'robots', content: 'noindex'});
    this.meta.updateTag({name: 'googlebot', content: 'noindex'});
  }

}
