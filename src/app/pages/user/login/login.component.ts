import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../services/common/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public formData: FormGroup;

  constructor(
    public userService: UserService,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.formData = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  onSubmitForm() {
    if (this.formData.invalid) {
      this.username.markAsTouched({onlySelf: true});
      this.password.markAsTouched({onlySelf: true});
      return;
    }
    this.userService.userLogin(this.formData.value);
  }

  /**
   * Form Validations
   */
  get username() {
    return this.formData.get('username');
  }

  get password() {
    return this.formData.get('password');
  }


}
