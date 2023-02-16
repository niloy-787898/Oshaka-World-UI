import {Component, OnInit} from '@angular/core';
import {UiService} from "../../../services/core/ui.service";
import {ReloadService} from "../../../services/core/reload.service";
import {BrandService} from "../../../services/common/brand.service";
import {Brand} from "../../../interfaces/common/brand.interface";
import {FilterData} from "../../../interfaces/core/filter-data";


@Component({
  selector: 'app-parent-categories',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {

  // Demo list of parent categories
  brands: Brand[] = [];

  constructor(
    private brandService: BrandService,
    private uiService: UiService,
    private reloadService: ReloadService,
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshBrands$
      .subscribe(() => {
        this.getAllBrands();
      });
    this.getAllBrands();
  }


  /**
   * HTTP REQ HANDLE
   */

  private getAllBrands() {

    // Select
    const mSelect = {
      name: 1,
      slug: 1,
      image: 1,
      priority: 1,
      brand: 1,
      readOnly: 1,
      createdAt: 1,
    }

    const filterData: FilterData = {
      pagination: null,
      filter: null,
      select: mSelect,
      sort: {createdAt: -1}
    }
    this.brandService.getAllBrands(filterData)
      .subscribe(res => {
        this.brands = res.data;

      }, error => {
        console.log(error);
      });

  }

}
