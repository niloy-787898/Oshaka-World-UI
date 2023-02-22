import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../../services/common/product.service';
import {UserService} from '../../../services/common/user.service';
import {UserDataService} from '../../../services/common/user-data.service';
import {CartService} from '../../../services/common/cart.service';
import {ReloadService} from '../../../services/core/reload.service';
import {UiService} from '../../../services/core/ui.service';
import {ShippingChargeService} from '../../../services/common/shipping-charge.service';
import {PricePipe} from '../../../shared/pipes/price.pipe';
import {Subscription} from 'rxjs';
import {ShippingCharge} from '../../../interfaces/common/shipping-charge.interface';
import {Cart} from '../../../interfaces/common/cart.interface';
import {User} from '../../../interfaces/common/user.interface';
import {Product} from '../../../interfaces/common/product.interface';
import {NgxSpinnerService} from 'ngx-spinner';
import {UtilsService} from '../../../services/core/utils.service';
import {OrderService} from '../../../services/common/order.service';
import {Address} from '../../../interfaces/common/address.interface';
import {OrderStatus} from '../../../enum/order.enum';
import {PaymentMethod} from '../../../interfaces/common/payment-method.interface';
import {PAYMENT_METHODS} from '../../../core/utils/app-data';
import {DATABASE_KEY} from '../../../core/utils/global-variable';
import {StorageService} from '../../../services/core/storage.service';
import {CouponService} from '../../../services/common/coupon.service';
import {Coupon} from '../../../interfaces/common/coupon.interface';
import {DiscountTypeEnum} from '../../../enum/product.enum';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {EngBnNumPipe} from "../../../shared/pipes/eng-bn-num.pipe";

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  providers: [PricePipe, EngBnNumPipe]
})
export class PaymentComponent implements OnInit {

  @ViewChild('formElement') formElement: NgForm;
  // Store data
  shippingCharge: ShippingCharge;
  carts: Cart[] = [];
  addressInfo: Address[] = [];
  selectedAddress: Address = null;
  user: User;
  isUserAuth: boolean = false;
  selectedPaymentMethod: string = null;
  isCheckedTerms: boolean = false;
  deliveryChargeByArea: number = 0;
  couponCode: string = null;
  coupon: Coupon = null;
  couponDiscount: number = 0;

  // Static Data
  paymentMethods: PaymentMethod[] = PAYMENT_METHODS;


  //Form group
  dataForm?: FormGroup;

  // Subscriptions
  private subCartReload: Subscription;
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;
  private subDataFive: Subscription;
  private subDataSix: Subscription;

  constructor(
    private productService: ProductService,
    private router: Router,
    public userService: UserService,
    public userDataService: UserDataService,
    private cartService: CartService,
    private reloadService: ReloadService,
    private uiService: UiService,
    private shippingChargeService: ShippingChargeService,
    private pricePipe: PricePipe,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private utilsService: UtilsService,
    private orderService: OrderService,
    private spinnerService: NgxSpinnerService,
    private storageService: StorageService,
    private couponService: CouponService,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    // On user login status change

    this.initFormGroup();
    this.userService.getUserStatusListener().subscribe(() => {
      this.isUserAuth = this.userService.getUserStatus();
      if (this.isUserAuth) {
        this.getLoggedInUserData();
      }
    });


    // Normal user status
    this.isUserAuth = this.userService.getUserStatus();
    if (this.isUserAuth) {
      this.getLoggedInUserData();
    }


    // CART FUNCTION
    this.subCartReload = this.reloadService.refreshCart$.subscribe(() => {
      this.getCartsItems();
    });
    // Base Data
    this.getCartsItems();
    this.getShippingCharge()
  }


  private initFormGroup() {
    this.dataForm = this.fb.group({
      phone: new FormControl(
        {value: null, disabled: false},
        [
          Validators.minLength(11)
        ]
      ),
      name: [this.user?.username, Validators.required],
      address: [null,],
      deliveryOptions:["1",],
      paymentOptions:["cash_on_delivery",],
    });

  }

  /**
   * HTTP REQ HANDLE
   * getLoggedInUserData()
   * getCartsItems()
   * getShippingCharge()
   */
  private getLoggedInUserData() {
    const select = 'name addresses email phoneNo username';
    this.subDataOne = this.userDataService.getLoggedInUserData(select)
      .subscribe(res => {
        this.user = res.data;
        console.log(this.user)
        this.dataForm.patchValue({'phone': this.user.username})
        if(this.user?.name){
          this.dataForm.patchValue({'name': this.user?.name})
        }

      }, error => {
        console.log(error);
      });
  }


  private getCartsItems() {
    this.subDataTwo = this.cartService.getCartByUser()
      .subscribe(res => {
        this.carts = res.data;
        console.log(this.carts)
      }, error => {
        console.log(error);
      });

  }

  private getShippingCharge() {
    this.subDataFive = this.shippingChargeService.getShippingCharge()
      .subscribe(res => {
        console.log('res', res)
        this.shippingCharge = res.data;
      }, err => {
        console.log(err);
      });
  }
  private addOrder(data: any) {
    this.spinnerService.show();
    this.subDataFour = this.orderService.addOrder(data)
      .subscribe(res => {
        this.spinnerService.hide();
        if (res.success) {
          this.uiService.success(res.message);
          this.reloadService.needRefreshCart$(false);
          console.log('this.dataForm.value.paymentMethods',this.dataForm.value.paymentMethods, 'res', res)
          if(res.data?.paymentType ==='bkash'){
            window.open('https://shop.bkash.com/osaka-dot-com01832883232/paymentlink/default-payment','_self')
          }
          else{
            localStorage.removeItem("orderId");
            localStorage.setItem("orderId", res.data.orderId);
            this.router.navigate(['/complete_order'],);
          }
        } else {
          this.uiService.warn(res.message);
        }
      }, error => {
        this.spinnerService.hide();
        console.log(error)
      })
  }

    // private getUserAddress() {
    //   this.subDataFive = this.userDataService.getUserAddress()
    //     .subscribe(res => {
    //       this.addressInfo = res.data;
    //       this.getSelectedAddress();
    //       this.getShippingCharge();
    //     }, err => {
    //       console.log(err);
    //     });
    // }

  public checkCouponAvailability() {

    if (!this.couponCode.trim()) {
      this.uiService.warn('Please enter your coupon code.')
      return;
    }

    this.subDataSix = this.couponService.checkCouponAvailability(
      {couponCode: this.couponCode, subTotal: this.cartSubTotal})
      .subscribe(res => {
        if (res.success) {
          this.uiService.success(res.message);
          this.coupon = res.data;
          if (this.coupon) {
            this.calculateCouponDiscount();
          }
        } else {
          this.uiService.warn(res.message);
        }
      }, error => {
        console.log(error);
      });
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required field');
      return;
    }
    // if (this.data) {
    //   this.editAddress();
    // } else {

    // }
  }

  /**
   * ROUTING
   */
  public onCLickCartIcon() {
    this.router.navigate(['/cart'])
  }



  public deliveryChargeChange(value){
    console.log(value)
  }

  addAddress(data: Address) {
    this.subDataOne = this.userDataService.addAddress(data)
      .subscribe((res) => {
        // this.uiService.success(res.message);
        // this.formElement.resetForm();
        // this.reloadService.needRefreshData$();
      }, error => {
        console.log(error);
      });
  }
  /**
   * On Confirm Order
   * onConfirmOrder()
   */
  public onConfirmOrder() {
    // if (!this.isCheckedTerms) {
    //   this.uiService.warn('Please accept ours terms & condition to continue.')
    //   return;
    // }
    // this.dataForm.markAllAsTouched();
    // if (!this.dataForm.value.name) {
    //   this.uiService.warn('Please enter name')
    //   return;
    // }
    // if (!this.dataForm.value.phone) {
    //   this.uiService.warn('Please enter phone')
    //   return;
    // }
    // if (!this.dataForm.value.address) {
    //   this.uiService.warn('Please enter address')
    //   return;
    // }
    // if (!this.dataForm.value.paymentOptions) {
    //   this.uiService.warn('Please select delivery charge')
    //   return;
    // }
    //
    // if (!this.dataForm.value.paymentOptions) {
    //   this.uiService.warn('Please select a payment method')
    //   return;
    // } // this.dataForm.markAllAsTouched();
    // if (!this.dataForm.value.name) {
    //   this.uiService.warn('Please enter name')
    //   return;
    // }
    // if (!this.dataForm.value.phone) {
    //   this.uiService.warn('Please enter phone')
    //   return;
    // }
    // if (!this.dataForm.value.address) {
    //   this.uiService.warn('Please enter address')
    //   return;
    // }
    // if (!this.dataForm.value.paymentOptions) {
    //   this.uiService.warn('Please select delivery charge')
    //   return;
    // }
    //
    // if (!this.dataForm.value.paymentOptions) {
    //   this.uiService.warn('Please select a payment method')
    //   return;
    // }


    // if (this.selectedPaymentMethod && this.selectedPaymentMethod !== 'cash_on_delivery') {
    //   this.uiService.warn('Cash on delivery is only available for now')
    //   return;
    // }

    // this.getShippingCharge();
    // const finalData = {...this.dataForm.value};
    // this.addAddress(finalData);

    // Product Info
    const products = this.carts.map(m => {
      return {
        _id: (m.product as Product)._id,
        name: (m.product as Product).name,
        slug: (m.product as Product).slug,
        image: (m.product as Product).images && (m.product as Product).images.length ? (m.product as Product).images[0] : null,
        category: {
          _id: (m.product as Product).category?._id,
          name: (m.product as Product).category?.name,
          slug: (m.product as Product).category?.slug,
        },
        subCategory: {
          _id: (m.product as Product).subCategory?._id,
          name: (m.product as Product).subCategory?.name,
          slug: (m.product as Product).category?.slug,
        },
        brand: {
          _id: (m.product as Product).brand?._id,
          name: (m.product as Product).brand?.name,
          slug: (m.product as Product).category?.slug,
        },
        regularPrice: this.pricePipe.transform((m.product as Product), 'regularPrice'),
        unitPrice: this.pricePipe.transform((m.product as Product), 'salePrice'),
        quantity: m.selectedQty,
        orderType: 'regular',
      } as any;
    });

    const orderData: any = {
      name: this.dataForm.value.name,
      phoneNo: this.dataForm.value.phone,
      shippingAddress: this.dataForm.value.address,
      paymentType: this.dataForm.value.paymentOptions,
      paymentStatus: 'unpaid',
      orderStatus: OrderStatus.PENDING,
      orderedItems: products,
      subTotal: this.cartSubTotal,
      deliveryCharge: this.dataForm.value.deliveryOptions==='1'? this.shippingCharge?.deliveryInDhaka : this.shippingCharge?.deliveryOutsideDhaka,
      discount: 0,
      totalSave: this.cartDiscountAmount,
      grandTotal: this.grandTotal,
      discountTypes: [],
      checkoutDate: this.utilsService.getDateString(new Date()),
      orderTimeline: null,
      hasOrderTimeline: false,
      user: this.user._id,
      coupon: this.coupon ? this.coupon._id : null,
      couponDiscount: this.couponDiscount
    }

    console.log(orderData)
    this.addOrder(orderData);

  }

  /**
   * Calculation
   * cartSubTotal()
   * grandTotal()
   * cartDiscountAmount()
   * calculateCouponDiscount()
   */

  get cartSubTotal(): number {
    return this.carts.map(t => {
      return this.pricePipe.transform(t.product as Product, 'salePrice', t.selectedQty) as number;
    }).reduce((acc, value) => acc + value, 0);
  }

  get grandTotal(): number {
    return (this.cartSubTotal +( this.dataForm.value.deliveryOptions==='1'? this.shippingCharge?.deliveryInDhaka : this.dataForm.value.deliveryOptions==='2'? this.shippingCharge?.deliveryOutsideDhaka: 0)) - this.couponDiscount;
  }

  get cartDiscountAmount(): number {
    return this.carts.map(t => {
      return this.pricePipe.transform(t.product as Product, 'discountAmount', t.selectedQty) as number;
    }).reduce((acc, value) => acc + value, 0);
  }

  private calculateCouponDiscount() {
    if (this.coupon.discountType === DiscountTypeEnum.PERCENTAGE) {
      this.couponDiscount = Math.floor((this.coupon.discountAmount / 100) * this.cartSubTotal)
    } else {
      this.couponDiscount = Math.floor(this.coupon.discountAmount)
    }
  }

  /**
   * CLICK EVENT LOGICAL
   * onSelectPaymentMethod()
   */
  onSelectPaymentMethod(data: PaymentMethod) {
    this.selectedPaymentMethod = data.slug;
  }

  onRemoveCoupon() {
    this.couponDiscount = 0;
    this.couponCode = null;
    this.coupon = null;
  }

  /**
   * Select & Get Active Address
   * onSelectAddress()
   */
  // private getSelectedAddress() {
  //   const addressData = this.storageService.getDataFromSessionStorage(DATABASE_KEY.selectedShippingAddress);
  //   if (addressData) {
  //     const fAddress = this.addressInfo.find(f => f._id === addressData._id);
  //     if (fAddress) {
  //       this.selectedAddress = fAddress;
  //     } else {
  //       this.router.navigate(['/shipping']);
  //     }
  //   } else {
  //     this.router.navigate(['/shipping']);
  //   }
  // }


  /**
   * NG ON DESTROY
   */
  ngOnDestroy() {
    if (this.subCartReload) {
      this.subCartReload.unsubscribe();
    }
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }
    if (this.subDataThree) {
      this.subDataThree.unsubscribe();
    }
    if (this.subDataFour) {
      this.subDataFour.unsubscribe();
    }
    if (this.subDataFive) {
      this.subDataFive.unsubscribe();
    }
    if (this.subDataSix) {
      this.subDataSix.unsubscribe();
    }

  }


}
