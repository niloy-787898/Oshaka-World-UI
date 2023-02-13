import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {UiService} from '../../../services/core/ui.service';
import {NewsletterService} from '../../../services/common/newsletter.service';
import {ReloadService} from '../../../services/core/reload.service';
import {ShopInformation} from '../../../interfaces/common/shop-information.interface';
import {FooterData} from "../../../interfaces/common/footer-data.interface";
import {UtilsService} from "../../../services/core/utils.service";
import {FooterDataService} from "../../../services/common/footer-data.service";
import {ShopInformationService} from "../../../services/common/shop-information.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit,OnDestroy {
  footerOnHide = true;
  footerData: FooterData;
  //Store Data
  shopInfo: ShopInformation

  // Links
  facebookLink: string = null;
  youtubeLink: string = null;
  instagramLink: string = null;
  twitterLink: string = null;
  linkedinLink: string = null;

  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm: FormGroup;

  //Subscription
   private footerHideRoute!:Subscription;
   private subDataOne!:Subscription;
   private subReloadOne:Subscription;

  constructor(
    private router:Router,
    private fb: FormBuilder,
    private uiService: UiService,
    private newsletterService: NewsletterService,
    private reloadService:ReloadService,
    private footerDataService: FooterDataService,
    private shopInformationService: ShopInformationService,
    private utilsService: UtilsService,
  ) { }


  ngOnInit(): void {
    this.initDataForm();
    this.getFooterData();
    this.subReloadOne = this.reloadService.refreshData$.subscribe(() =>{
      this.getShopInfo()
    })
    this.getShopInfo()
  }

  /**
   * FORM CONTROL
   * initDataForm()
   * onSubmit()
   */
  private initDataForm() {
    this.dataForm = this.fb.group({
      email: ['', Validators.email],
    });
  }


  onSubmit(dataForm: NgForm) {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please Enter Your Email Address.')
      return;
    }
    this.addSubscribers();

    if (dataForm.invalid) {
      this.uiService.warn('Please enter a valid email');
      return;
    }
    if (this.utilsService.validateEmail(dataForm.value.email)) {
      this.newsletterService.addNewsletter(dataForm.value)
        .subscribe(res => {
          this.uiService.success(res.message);
          dataForm.resetForm();
        }, error => {
          console.log(error);
        });
    } else{
      this.uiService.warn('Please insert valid email Address');
    }
  }

  /**
   * HTTP REQ HANDLE
   * addContact()
   * getShopInfo()
   */
  private addSubscribers() {
    // this.spinner.show();
    this.subDataOne = this.newsletterService.addNewsletter(this.dataForm.value)
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
  private getShopInfo() {
    // this.spinner.show();
    this.subDataOne = this.shopInformationService.getShopInformation()
      .subscribe({
        next: (res => {
          this.shopInfo = res.data
          if (this.shopInfo) {
            this.getSocialLink();
          }
        }),
        error: (error => {
          // this.spinner.hide();
          console.log(error);
        })
      });
  }

  getSocialLink(){
    this.shopInfo.socialLinks.forEach(f => {
      switch (f.type){
        case 0: this.facebookLink = f.value
          break;

        case 1: this.youtubeLink = f.value
          break;

        case 2: this.twitterLink = f.value
          break;

        case 3: this.instagramLink = f.value
          break;

        case 4: this.linkedinLink = f.value
          break;
      }
    })
  }

  /**
   * Footer Controll
   */
  footerControll(){
    //Navigate footer hide
    this.footerHideRoute = this.router.events.subscribe(() =>{
      if(this.router.url == "/login" || this.router.url =="/registration" || this.router.url == "/reset-password"){
        this.footerOnHide = false;
      }else{
        this.footerOnHide = true;
      }
    })

    //Initial Footer Hide
    if(this.router.url == "/login" || this.router.url =="/registration" || this.router.url == "/reset-password"){
      this.footerOnHide = false;
    }else{
      this.footerOnHide = true;
    }

  }
  /**
   * Destroy Subscribe
   */

  private getFooterData() {
    this.footerDataService.getFooterData()
      .subscribe(res => {
        this.footerData = res.data;
        console.log("this.footerData",this.footerData)
      }, err => {
        console.log(err);
      });
  }






  ngOnDestroy(): void {
    if(this.footerHideRoute){
      this.footerHideRoute.unsubscribe();
    }
    if(this.subDataOne){
      this.subDataOne.unsubscribe();
    }
    if(this.subReloadOne){
      this.subReloadOne.unsubscribe();
    }
  }

}
