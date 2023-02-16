import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {UiService} from "../../../services/core/ui.service";
import {AttributeService} from "../../../services/common/attribute.service";
import {ProductAttribute} from "../../../interfaces/common/product-attribute";
import {ReloadService} from "../../../services/core/reload.service";


@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.scss']
})
export class AttributesComponent implements OnInit {


  attributes: ProductAttribute[] = [];

  constructor(
    private attributeService: AttributeService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshAttributes$
      .subscribe(() => {
        this.getAllAttributes();
      });
    this.getAllAttributes();
  }


  /**
   * HTTP REQ HANDLE
   */

  private getAllAttributes() {
    this.spinner.show();
    this.attributeService.getAllAttributes()
      .subscribe(res => {
        this.attributes = res.data;
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }


}
