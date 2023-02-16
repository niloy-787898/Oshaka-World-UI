import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

import {NgxSpinnerService} from 'ngx-spinner';
import {UiService} from "../../../../services/core/ui.service";
import {TagService} from "../../../../services/common/tag.service";
import {UtilsService} from "../../../../services/core/utils.service";
import {StorageService} from "../../../../services/core/storage.service";
import {Tag} from "../../../../interfaces/common/tag.interface";

@Component({
  selector: 'app-add-new-tag',
  templateUrl: './add-new-tag.component.html',
  styleUrls: ['./add-new-tag.component.scss']
})
export class AddNewTagComponent implements OnInit {

  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  dataForm?: FormGroup;
  private sub: Subscription;

  autoSlug = true;
  isLoading = false;

  // Store Data from param
  id?: string;
  tag: Tag;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private tagService: TagService,
    private utilsService: UtilsService,
    private storageService: StorageService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      tagName: [null, Validators.required],
      tagSlug: [null, Validators.required]
    });

    this.autoGenerateSlug();

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getTagByTagId();
        console.log('Iam in edit mood');
      }
    });
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }

    if (this.tag) {
      const finalData = {...this.dataForm.value, ...{_id: this.tag._id}};
      this.editTagData(finalData);
    } else {
      this.addTag(this.dataForm.value);
    }

  }

  autoGenerateSlug() {
    if (this.autoSlug === true) {
      this.sub = this.dataForm.get('tagName').valueChanges
        .pipe(
          // debounceTime(200),
          // distinctUntilChanged()
        ).subscribe(d => {
          const res = d?.trim().replace(/[^A-Z0-9]+/ig, '-').toLowerCase();
          this.dataForm.patchValue({
            tagSlug: res
          });
        });
    } else {
      if (this.sub === null || this.sub === undefined) {
        return;
      }
      this.sub.unsubscribe();
    }
  }

  /**
   * ON HOLD INPUT DATA
   */

  onHoldInputData() {
    this.storageService.storeInputData(this.dataForm?.value, 'TAG_INPUT');
  }


  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  private addTag(data: Tag) {
    this.spinner.show();
    this.tagService.addTag(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.templateForm.resetForm();
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  private getTagByTagId() {
    this.spinner.show();
    this.tagService.getTagByTagId(this.id)
      .subscribe(res => {
        if (res.data) {
          this.dataForm.patchValue(res.data);
          this.tag = res.data;
          this.spinner.hide();
        }
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  private editTagData(data: Tag) {
    this.spinner.show();
    this.tagService.editTagData(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.storageService.removeSessionData('TAG_INPUT');
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }


}
