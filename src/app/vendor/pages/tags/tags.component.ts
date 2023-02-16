import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';

import {NgxSpinnerService} from 'ngx-spinner';
import {TagService} from "../../../services/common/tag.service";
import {UiService} from "../../../services/core/ui.service";
import {ReloadService} from "../../../services/core/reload.service";
import {Pagination} from "../../../interfaces/core/pagination";
import {Tag} from "../../../interfaces/common/tag.interface";


@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {

  tags: Tag[] = [];

  constructor(
    private dialog: MatDialog,
    private tagService: TagService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshTags$
      .subscribe(() => {
        this.getAllTags();
      });
    this.getAllTags();
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
        console.log('Data should be deleted');
        this.deleteTag(data);
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAllTags() {
    this.spinner.show();
    const pagination: Pagination = {
      currentPage: String(1),
      pageSize: String(50)
    };
    this.tagService.getAllTagList(pagination)
      .subscribe(res => {
        this.tags = res.data;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  /**
   * DELETE METHOD HERE
   */
  private deleteTag(id: string) {
    this.spinner.show();
    this.tagService.deleteTag(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshTags$();
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

}
