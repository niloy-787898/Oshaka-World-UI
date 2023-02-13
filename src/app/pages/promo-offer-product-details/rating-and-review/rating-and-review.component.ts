import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {UiService} from '../../../services/core/ui.service';
import {UserService} from '../../../services/common/user.service';
import {UtilsService} from '../../../services/core/utils.service';
import {UserDataService} from '../../../services/common/user-data.service';
import {ReloadService} from '../../../services/core/reload.service';
import {Subscription} from 'rxjs';
import {ReviewService} from '../../../services/common/review.service';
import {Review} from '../../../interfaces/common/review.interface';
import {User} from '../../../interfaces/common/user.interface';

@Component({
  selector: 'app-rating-and-review',
  templateUrl: './rating-and-review.component.html',
  styleUrls: ['./rating-and-review.component.scss']
})
export class RatingAndReviewComponent implements OnInit, OnDestroy {
  // Rating
  @Input() pageUrl: string = null;
  @Input() productId: string = null;
  @Input() rating = 0;
  @ViewChild('formElement') formElRef: NgForm;


  // SUBSCRIPTIONS
  private subDataOne: Subscription;

  constructor(
    private uiService: UiService,
    public userService: UserService,
    public userDataService: UserDataService,
    public reloadService: ReloadService,
    public utilsService: UtilsService,
    public reviewService: ReviewService,
  ) {
  }

  ngOnInit(): void {
  }


  onRatingChanged(rating) {
    this.rating = rating;
  }

  /**
   * ON SUBMIT
   */
  onSubmitReview(formData: NgForm) {
    if (formData.invalid) {
      this.uiService.warn('Please write your review');
      return;
    }
    if (this.rating === 0) {
      this.uiService.warn('Please rate with star');
      return;
    }

    const data: Review = {
      review: formData.value.text,
      rating: this.rating,
      reviewDate: this.utilsService.getDateString(new Date()),
      product: this.productId,
      status: false,
      replyDate: null,
      reply: null,
    };
    console.log("data", data)

    this.addReview(data);
  }

  /**
   * RESET
   */
  private reset() {
    this.rating = 0;
    this.formElRef.resetForm();
  }

  /**
   * HTTP REQ HANDLE
   * addReview()
   */

  private addReview(review: Review) {
    this.subDataOne = this.reviewService.addReview(review)
      .subscribe(res => {
        this.uiService.success('Your review is under process');
        this.reloadService.needRefreshData$();
        this.reset();
      }, error => {
        console.log(error);
      });
  }



  /**
   * NG ON DESTROY
   */
  ngOnDestroy() {
    if(this.subDataOne){
      this.subDataOne.unsubscribe();
    }
  }

}
