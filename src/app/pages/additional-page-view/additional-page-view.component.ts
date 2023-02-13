import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AdditionalPageService} from '../../services/core/additional-page.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-extra-page-view',
  templateUrl: './additional-page-view.component.html',
  styleUrls: ['./additional-page-view.component.scss']
})
export class AdditionalPageViewComponent implements OnInit, OnDestroy {

  slug: string = null;
  pageInfo: any = '';
  msg = '';

  //Subscription
  private subRouteOne: Subscription
  private subReloadOne: Subscription

  constructor(
    private activatedRoute: ActivatedRoute,
    private additionalPageService: AdditionalPageService,
  ) {
  }

  ngOnInit(): void {
    this.subReloadOne = this.activatedRoute.paramMap.subscribe(param => {
      this.slug = param.get('pageSlug');
      this.getPageInfo();
    });

  }

  /**
   * HTTP REQ HANDLE
   * @private
   */

  private getPageInfo() {
    this.subRouteOne = this.additionalPageService.getAdditionalPageBySlug(this.slug)
      .subscribe(res => {
        this.pageInfo = res.data;
        if (!this.pageInfo) {
          this.msg = '<h2>Coming Soon!</h2>'
        }
      }, error => {
        console.log(error);
      });
  }

  /**
   * NG DESTROY
   */
  ngOnDestroy() {
    if(this.subRouteOne){
      this.subRouteOne.unsubscribe()
    }
    if(this.subReloadOne){
      this.subReloadOne.unsubscribe()
    }
  }

}
