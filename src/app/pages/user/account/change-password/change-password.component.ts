import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UiService} from '../../../../services/core/ui.service';
import {UserService} from '../../../../services/common/user.service';
import {UserDataService} from '../../../../services/common/user-data.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  // For Reset
  @ViewChild('formDirective') formDirective: NgForm;

  public formData: FormGroup;

  private subDataOne: Subscription;

  constructor(
    private userService: UserService,
    private userDataService: UserDataService,
    private uiService: UiService,
    private router: Router,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.formData = this.fb.group({
      oldPassword: [null, Validators.required],
      password: [null, Validators.required]
    });
  }


  /**
   * On submit
   * onSubmitForm()
   */
  onSubmitForm() {
    if (this.formData.invalid) {
      return;
    }

    if (this.formData.value.password.length < 6) {
      this.uiService.warn('Password must be at lest 6 characters!');
      return;
    }
    this.updatePassword();

  }

  /**
   * Http req handle
   * updatePassword()
   */

  private updatePassword() {
    this.subDataOne = this.userDataService.changeLoggedInUserPassword(this.formData.value)
      .subscribe(res => {
        if (res.success) {
          this.uiService.success(res.message);
          this.formDirective.resetForm();
          // this.router.navigate(['/dashboard']);
        } else {
          this.uiService.wrong(res.message);
        }
      }, error => {
        console.log(error);
      });
  }

  /**
   * Ng On Destroy
   */

  ngOnDestroy(): void {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe()
    }

  }

}
