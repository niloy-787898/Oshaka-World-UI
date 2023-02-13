import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {UiService} from '../../services/core/ui.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ContactService} from '../../services/common/contact.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit, OnDestroy {

  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm: FormGroup;

  // Subscriptions
  subDataOne: Subscription;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private uiService: UiService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.initDataForm();
  }


  /**
   * FORM CONTROL
   * initDataForm()
   * onSubmit()
   */
  private initDataForm() {
    this.dataForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.email],
      phoneNo: ['', Validators.required],
      address: ['', Validators.required],
      message: ['', Validators.required],
      emailSent: [false],
    });
  }


  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required field.')
      return;
    }
    this.addContact();
  }

  /**
   * HTTP REQ HANDLE
   * addContact()
   */
  private addContact() {
    // this.spinner.show();
    this.subDataOne = this.contactService.addContact(this.dataForm.value)
      .subscribe({
        next: (res => {
          console.log(res);
          // this.spinner.hide();
          this.uiService.success(res.message);
          this.formElement.resetForm();
        }),
        error: (error => {
          // this.spinner.hide();
          console.log(error);
        })
      });
  }


  /**
   * ON DESTROY
   */
  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
  }


}
