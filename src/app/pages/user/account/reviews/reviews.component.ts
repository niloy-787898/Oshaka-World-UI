import { Component, OnInit } from '@angular/core';
// import {ReviewControl} from '../../../../interfaces/review-control';
// import {ReviewControlService} from '../../../../services/review-control.service';
// import {UiService} from '../../../../services/ui.service';
// import {ReloadService} from '../../../../services/reload.service';
// import {UserDataService} from '../../../../services/user-data.service';
// import {User} from '../../../../interfaces/user';
import {ConfirmDialogComponent} from '../../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {Pagination} from '../../../../interfaces/core/pagination';
import {FilterData} from '../../../../interfaces/core/filter-data';
import {Subscription} from 'rxjs';
import {Review} from '../../../../interfaces/common/review.interface';
import {UiService} from '../../../../services/core/ui.service';
import {ReviewService} from '../../../../services/common/review.service';
import {ReloadService} from '../../../../services/core/reload.service';
import {UserDataService} from '../../../../services/common/user-data.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {

  // Store Data
  allReviews: Review[] = [];
  user: any = null;

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 12;
  totalProductsStore = 0;

  // Subscription
  private subDataOne: Subscription;

  constructor(
    private reviewService: ReviewService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private userDataService: UserDataService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.reloadService.refreshData$
      .subscribe(() => {
        this.getReviewByUserId();
      });

    this.userDataService.getLoggedInUserData('fullName')
      .subscribe(res => {
        this.user = res.data;
        if (this.user) {
          this.getReviewByUserId();
        }
      }, error => {
        console.log(error);
      });

  }

  private getReviewByUserId() {


    this.subDataOne = this.reviewService.getReviewByUserId()
      .subscribe(res => {
        this.allReviews = res.data;
        console.log("all reviews", this.allReviews)
      }, error => {
        console.log(error);
      });
  }


  /**
   * COMPONENT DIALOG VIEW
   */
  public openConfirmDialog(data?: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this category?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteReviewByReviewId(data);
      }
    });
  }

  /**
   * DELETE METHOD HERE
   */
  private deleteReviewByReviewId(id: string) {
    this.reviewService.deleteReviewByReviewId(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshData$();
      }, error => {
        console.log(error);
      });
  }



}
