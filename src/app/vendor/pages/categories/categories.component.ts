import {Component, OnInit} from '@angular/core';
import {UiService} from "../../../services/core/ui.service";
import {CategoryService} from "../../../services/common/category.service";
import {ReloadService} from "../../../services/core/reload.service";
import {Category} from "../../../interfaces/common/category.interface";


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  // Demo list of parent categories
  categories: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private uiService: UiService,
    private reloadService: ReloadService,
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshCategories$
      .subscribe(() => {
        this.getAllCategory();
      });
    this.getAllCategory();
  }


  /**
   * HTTP REQ HANDLE
   */

  private getAllCategory() {
    this.categoryService.getAllCategory()
      .subscribe(res => {
        console.log(res);
        this.categories = res.data;
      }, error => {
        console.log(error);
      });
  }


}
