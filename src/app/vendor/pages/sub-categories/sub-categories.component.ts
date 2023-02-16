import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {SubCategoryService} from "../../../services/common/sub-category.service";
import {UiService} from "../../../services/core/ui.service";
import {ReloadService} from "../../../services/core/reload.service";
import {SubCategory} from "../../../interfaces/common/sub-category.interface";


@Component({
  selector: 'app-sub-categories',
  templateUrl: './sub-categories.component.html',
  styleUrls: ['./sub-categories.component.scss']
})
export class SubCategoriesComponent implements OnInit {

  subCategories: SubCategory[] = [];

  constructor(
    private dialog: MatDialog,
    private subCategoryService: SubCategoryService,
    private uiService: UiService,
    private reloadService: ReloadService
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshSubCategories$
      .subscribe(() => {
        this.getAllSubCategory();
      });
    this.getAllSubCategory();
  }


  /**
   * HTTP REQ HANDLE
   */

  private getAllSubCategory() {
    this.subCategoryService.getAllSubCategory()
      .subscribe(res => {
        this.subCategories = res.data;
      }, error => {
        console.log(error);
      });
  }


}
