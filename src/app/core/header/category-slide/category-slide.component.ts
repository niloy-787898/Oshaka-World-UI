import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {CategoryMenu} from 'src/app/interfaces/common/category-menu.interface';
import {SubCategoryService} from 'src/app/services/common/sub-category.service';

@Component({
  selector: 'app-category-slide',
  templateUrl: './category-slide.component.html',
  styleUrls: ['./category-slide.component.scss']
})
export class CategorySlideComponent implements OnInit, OnDestroy {
  //Store Data
  categoryMenus: CategoryMenu[] = [];
  toggleSub: any;

  // Subscriptions
  private subDataOne: Subscription;
  //CategorySlide
  categorySlide = false;

  constructor(
    private subCategoryService: SubCategoryService,
  ) {
  }


  ngOnInit(): void {
    this.getSubCategoriesGroupByCategory();
  }


  /***
   * getAllCategories()
   * onShowCategory()
   *  onHideCategory()
   */
  private getSubCategoriesGroupByCategory() {
    this.subDataOne = this.subCategoryService.getSubCategoriesGroupByCategory()
      .subscribe(res => {
        this.categoryMenus = [...res.data];
      }, error => {
        console.log(error);
      });
  }

  onShowCategory() {
    this.categorySlide = true;
  }

  onHideCategory() {
    this.categorySlide = false;
  }

  showSub(id: any) {

    if (this.toggleSub === id) {
      this.toggleSub = null;
    } else {
      this.toggleSub = id;
    }

  }

  ngOnDestroy(): void {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
  }

}
