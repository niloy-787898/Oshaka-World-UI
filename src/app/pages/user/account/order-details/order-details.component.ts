import {Component, OnInit, ViewChild} from '@angular/core';
import {CITIES, ORDER_STATUS, PAYMENT_STATUS, PAYMENT_TYPES, PDF_MAKE_LOGO} from '../../../../core/utils/app-data';
import {Select} from '../../../../interfaces/core/select';
import {DiscountType, Order} from '../../../../interfaces/common/order.interface';
import {Subscription} from 'rxjs';
import {Product} from '../../../../interfaces/common/product.interface';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import {UtilsService} from '../../../../services/core/utils.service';
import {PricePipe} from '../../../../shared/pipes/price.pipe';
import {UiService} from '../../../../services/core/ui.service';
import {OrderService} from '../../../../services/common/order.service';
import {NgxSpinnerService} from 'ngx-spinner';
import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';

import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
  providers: [PricePipe]
})
export class OrderDetailsComponent implements OnInit {


  // Static Data
  cities: string[] = CITIES;
  paymentTypes: any[] = PAYMENT_TYPES;
  paymentStatus: Select[] = PAYMENT_STATUS;
  orderStatus: Select[] = ORDER_STATUS;

  // Store Data
  id?: string;
  order?: Order;

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subRouteOne: Subscription;
  private subRouteTwo: Subscription;
  selectedProducts: Product[] = [];

  // Calculation data
  deliveryCharge: number = 50;
  discount: number = 0;
  additionalDiscount: number = 0;

  // Discount Types
  discountTypes: DiscountType[] = [];

  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private utilsService: UtilsService,
    private pricePipe: PricePipe,
    private uiService: UiService,
    private orderService: OrderService,
    private spinnerService: NgxSpinnerService,
  ) {
    (window as any).pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  ngOnInit(): void {
    // Init Form
    this.initDataForm();


    // GET ID FORM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getOrderById();
      }
    });
  }


  /**
   * INIT FORM
   * initDataForm()
   * setDataForm()
   */
  private initDataForm() {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      phoneNo: [null, Validators.required],
      email: [null, Validators.email],
      city: [null, Validators.required],
      shippingAddress: [null, Validators.required],
      paymentType: [this.paymentTypes[0].value, Validators.required],
      paymentStatus: [this.paymentStatus[0].value, Validators.required],
      orderStatus: [this.orderStatus[0].value, Validators.required],
    });
  }

  private setDataForm() {
    if (this.order) {
      this.dataForm.patchValue(this.order);
      this.deliveryCharge = this.order.deliveryCharge;
      this.discount = this.order.discount;
      this.discountTypes = this.order.discountTypes;

      // const hasAdditionalDis = this.order.discountTypes.find(f => f.type === 'additional');
      // this.additionalDiscount = hasAdditionalDis ? hasAdditionalDis.amount : 0;
      this.selectedProducts = this.order.orderedItems.map(m => {
        return {
          _id: m._id,
          name: m.name,
          slug: m.slug,
          images: [m.image],
          costPrice: m.regularPrice,
          salePrice: m.unitPrice,
          category: m.category,
          subCategory: m.subCategory,
          brand: m.brand,
          selectedQty: m.quantity,
        } as Product
      });
    }
  }

  onSubmit() {

    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required field');
      this.dataForm.markAllAsTouched();
      return;
    }

    if (!this.selectedProducts.length) {
      this.uiService.warn('Please select product on cart')
      return;
    }

    // Product Info
    const products = this.selectedProducts.map(m => {
      return {
        _id: m._id,
        name: m.name,
        slug: m.slug,
        image: m.images && m.images.length ? m.images[0] : null,
        category: {
          _id: m.category?._id,
          name: m.category?.name,
          slug: m.category?.slug,
        },
        subCategory: {
          _id: m.subCategory?._id,
          name: m.subCategory?.name,
          slug: m.category?.slug,
        },
        brand: {
          _id: m.brand?._id,
          name: m.brand?.name,
          slug: m.category?.slug,
        },
        regularPrice: this.pricePipe.transform(m, 'regularPrice'),
        unitPrice: this.pricePipe.transform(m, 'salePrice'),
        quantity: m.selectedQty,
        orderType: 'regular',
      } as any;
    });

    // Discount Types set
    if (this.additionalDiscount && this.additionalDiscount > 0) {
      const hasAdditionalDis = this.discountTypes.find(f => f.type === 'additional');
      if (hasAdditionalDis) {
        const index = this.discountTypes.findIndex(f => f.type === 'additional');
        this.discountTypes[index].amount = this.additionalDiscount

      } else {
        this.discountTypes.push({type: 'additional', amount: this.additionalDiscount});
      }
    }

    const orderData = {
      name: this.dataForm.value.name,
      phoneNo: this.dataForm.value.phoneNo,
      email: this.dataForm.value.email,
      city: this.dataForm.value.city,
      shippingAddress: this.dataForm.value.shippingAddress,
      paymentType: this.dataForm.value.paymentType,
      paymentStatus: this.dataForm.value.paymentStatus,
      orderStatus: this.dataForm.value.orderStatus,
      orderedItems: products,
      subTotal: this.cartSubTotal,
      deliveryCharge: this.deliveryCharge,
      discount: this.discountTotal,
      grandTotal: this.grandTotal,
      discountTypes: this.discountTypes,
      checkoutDate: this.utilsService.getDateString(new Date()),
      deliveryDate: null,
      user: null
    }

    console.log('orderData', orderData)
  }

  /**
   * CALCULATION
   */

  get cartSubTotal(): number {
    return this.selectedProducts.map(t => {
      return this.pricePipe.transform(t, 'salePrice', t.selectedQty) as number;
    }).reduce((acc, value) => acc + value, 0);
  }

  get discountTotal(): number {
    return this.discount + this.additionalDiscount;
  }

  get grandTotal(): number {
    return ((this.cartSubTotal + this.deliveryCharge) - this.discountTotal)
  }


  /**
   * CART FUNCTION
   */

  incrementQty(index: number) {
    this.selectedProducts[index].selectedQty = this.selectedProducts[index].selectedQty + 1
  }

  decrementQty(index: number) {
    if (this.selectedProducts[index].selectedQty === 1) {
      this.uiService.warn('Minimum quantity is 1');
      return;
    }

    this.selectedProducts[index].selectedQty = this.selectedProducts[index].selectedQty - 1
  }

  /**
   * ACTION
   */
  removeProduct(i: number) {
    this.selectedProducts.splice(i, 1)
  }

  /**
   * HTTP REQ HANDLE
   *  getOrderById()
   * addOrder()
   * updateOrderById()
   * resetValue()
   */
  private getOrderById() {
    this.spinnerService.show();
    // const select = ''
    this.subRouteTwo = this.orderService.getOrderById(this.id)
      .subscribe(res => {
        this.spinnerService.hide();
        if (res.success) {
          this.order = res.data;
          this.setDataForm();
        }
      }, error => {
        this.spinnerService.hide();
        console.log(error)
      })
  }

  private addOrder(data: any) {
    this.spinnerService.show();
    this.subDataOne = this.orderService.addOrder(data)
      .subscribe(res => {
        this.spinnerService.hide();
        if (res.success) {
          this.uiService.success(res.message);
          this.resetValue();
        } else {
          this.uiService.warn(res.message);
        }
      }, error => {
        this.spinnerService.hide();
        console.log(error)
      })
  }

  private updateOrderById(data: any) {
    this.spinnerService.show();
    this.subDataThree = this.orderService.updateOrderById(this.order._id, data)
      .subscribe(res => {
        this.spinnerService.hide();
        if (res.success) {
          this.uiService.success(res.message);
        } else {
          this.uiService.warn(res.message);
        }
      }, error => {
        this.spinnerService.hide();
        console.log(error);
      });
  }

  private resetValue() {
    this.formElement.resetForm();
    this.selectedProducts = [];
    this.discountTypes = [];
  }

  /**
   * NEW PDF MAKE
   * ASYNC FUNCTION (FOR IMAGE COMPRESS)
   * downloadPdfInvoice()
   * getInvoiceDocument()
   * getDocumentDefinitionForPdf()
   * getProfilePicObjectPdf()
   * getPaymentTable()
   * urlToBase64()
   * getBase64ImageFromURL()
   * dataTableForPdfMake()
   * getItemTable()
   * getCalculationTable()
   * pdfMakeStyleObject()
   */

  async downloadPdfInvoice(type?: string) {

    const documentDefinition = await this.getInvoiceDocument();

    if (type === 'download') {
      pdfMake.createPdf(documentDefinition).download(`Order_${this.order.orderId}.pdf`);
    } else if (type === 'print') {
      pdfMake.createPdf(documentDefinition).print();
    } else {
      pdfMake.createPdf(documentDefinition).download(`Order_${this.order.orderId}.pdf`);
    }

  }

  private async getInvoiceDocument() {
    const documentObject = {
      content: [
        {
          columns: [
            await this.getProfilePicObjectPdf(),
            [
              {
                width: 'auto',
                text: `www.heriken.co`,
                style: 'p',
              },
              // {
              //   width: 'auto',
              //   text: `House: 3/4, 5th Floor, Avenue-5, Block-A, Mirpur-6, Dhaka-1216`,
              //   style: 'p',
              // },
              // {
              //   width: 'auto',
              //   text: `Telephone:+8801648879969`,
              //   style: 'p',
              // },
              // {
              //   width: 'auto',
              //   text: `Email:softlabit.info@gmail.com`,
              //   style: 'p',
              // },
            ],
            [
              {
                width: '*',
                text: [
                  `Invoice ID: `,
                  {
                    text: 'SL-' + this.order?.orderId,
                    bold: true
                  }
                ],
                style: 'p',
                alignment: 'right'
              },
              {
                width: '*',
                text: `${this.utilsService.getDateString(new Date(), 'll')} (${this.order.name})`,
                style: 'p',
                alignment: 'right'
              },
            ]
          ],
          columnGap: 16
        }, // END TOP INFO SECTION
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 5,
              x2: 535,
              y2: 5,
              lineWidth: 0.5,
              lineColor: '#E8E8E8'
            }
          ]
        }, // END TOP INFO BORDER
        {
          columns: [
            [
              {
                width: 'auto',
                text: `Order Info:`,
                style: 'p',
                margin: [0, 8, 0, 0]
              },
              {
                width: 'auto',
                text: [
                  `Order Id: `,
                  {
                    text: '#' + this.order.orderId,
                    bold: true
                  }
                ],
                style: 'p',
              },
              {
                width: 'auto',
                text: `Date Added: ${this.utilsService.getDateString(new Date(), 'll')}`,
                style: 'p',
              },
              {
                width: 'auto',
                text: [
                  `Payment Status: `,
                  {
                    text: this.order.paymentStatus,
                    bold: true
                  }
                ],
                style: 'p',
              },
              {
                width: 'auto',
                text: [
                  `Total Product: `,
                  {
                    text: `${this.order.orderedItems.length}Items`,
                    bold: true
                  }
                ],
                style: 'p',
              },
            ],
            {
              width: '*',
              alignment: 'left',
              text: '',
            }, // Middle Space for Make Column Left & Right
            [
              {
                width: 'auto',
                text: `Delivery Address:`,
                style: ['p'],
                margin: [0, 8, 0, 0]
              },
              {
                width: 'auto',
                text: [
                  `Name: `,
                  {
                    text: this.order.name,
                    bold: true
                  }
                ],
                style: 'p',
              },
              {
                width: 'auto',
                text: `Address: ${this.order.shippingAddress}`,
                style: ['pBn'],
              },
              {
                width: 'auto',
                text: [
                  `Phone: `,
                  {
                    text: this.order.phoneNo,
                    bold: true
                  }
                ],
                style: 'p',
              },
            ],
          ],
          columnGap: 16
        },
        {
          style: 'gapY',
          columns: [
            this.getItemTable(),
          ]
        }, // END ITEM TABLE SECTION
        {
          style: 'gapY',
          columns: [
            {
              width: '*',
              alignment: 'left',
              text: '',
            }, // Middle Space for Make Column Left & Right
            [
              this.getCalculationTable()
            ]
          ]
        }, // END CALCULATION SECTION
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 5,
              x2: 535,
              y2: 5,
              lineWidth: 0.5,
              lineColor: '#E8E8E8'
            }
          ]
        }, // END TOP INFO BORDER
        {
          text: 'Thank you for your order from www.heriken.co',
          style: 'p',
          alignment: 'center',
          margin: [0, 10]
        }
      ],
      styles: this.pdfMakeStyleObject
    }

    return documentObject;
  }

  async getDocumentDefinitionForPdf() {
    return {
      content: [
        {
          text: 'Invoice',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          columns: [
            [
              await this.getProfilePicObjectPdf()
            ],
            [{
              text: `Invoice:  #100`,
              style: 'name',
              alignment: 'right'
            },
              {
                text: '20/10/2021',
                alignment: 'right'
              },
              {
                text: 'Customer Id : ' + '100',
                alignment: 'right'
              },
              {
                text: 'Bill Type : ' + 'Regular',
                alignment: 'right'
              }
            ]
          ]
        },
        {
          style: 'gapBig',
          columns: [
            [
              {
                text: 'From',
                alignment: 'left'
              },
              {
                text: 'Cash Management',
                style: 'name',
                alignment: 'left'
              },
              {
                text: 'Mirpur-10, Dhaka-1216',
                alignment: 'left'
              },
              {
                text: '+8801773253900',
                alignment: 'left'
              },
              {
                text: 'www.cashmanagement.com',
                alignment: 'left'
              },
            ],
            [{
              text: 'To',
              alignment: 'right'
            },
              {
                text: 'Md Sazib',
                style: 'name',
                alignment: 'right'
              },
              {
                text: '01773253900',
                alignment: 'right'
              },
              {
                text: 'Sazib Store',
                alignment: 'right'
              },
              {
                text: 'Mirpur',
                alignment: 'right'
              },
            ]
          ]
        },
        {
          text: '',
          style: 'gapBig'
        },
        this.getPaymentTable(),
        {
          text: '',
          style: 'gapSmall'
        },
        {
          text: '',
          alignment: 'right'
        },
        {
          text: 'Sub Total     ' + '900' + ' /-',
          style: 'totalInfo',
          alignment: 'right'
        },
        {
          text: 'Vat(15%)     ' + '2000' + ' /-',
          style: 'totalInfo',
          alignment: 'right'
        },
        {
          text: 'Total     ' + '5000' + ' /-',
          style: 'totalInfo',
          alignment: 'right'
        },
        {
          text: 'Thank you for your business!',
          alignment: 'center',
          style: 'gapBig'
        },
        {
          text: 'If you have any questions about this invoice, please contact with us',
          alignment: 'center',
        },

        {
          style: 'gapBig',
          columns: [
            [{
              text: 'wqijw',
              style: 'name',
              alignment: 'left'
            },
              {
                text: '01287321313',
                alignment: 'left'
              },
              {
                text: 'asnass@gmail.com',
                alignment: 'left'
              },
              {
                text: 'Visit Facebook Page',
                link: 'https://www.facebook.com/cashmanagementltd',
                color: 'blue',
                alignment: 'left'
              }
            ],
            [
              {
                qr: 'Cash , Contact No : 01773253900',
                fit: 100,
                alignment: 'right'
              }
            ]
          ]
        }
      ],
      info: {
        title: 'Cash Invoice',
        author: 'Sazib',
        subject: 'Invoice',
        keywords: 'Invoice',
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 20, 0, 10],
          decoration: 'underline'
        },
        name: {
          fontSize: 16,
          bold: true
        },
        totalInfo: {
          fontSize: 12,
          bold: true,
          lineHeight: 1.5
        },
        jobTitle: {
          fontSize: 14,
          bold: true,
          italics: true
        },
        sign: {
          margin: [0, 50, 0, 10],
          alignment: 'right',
          italics: true
        },
        tableHeader: {
          bold: true,
        },
        gapMid: {
          margin: [0, 20, 0, 10],
        },
        gapBig: {
          margin: [0, 40, 0, 20],
        },
        gapSmall: {
          margin: [0, 10, 0, 5],
        },
      }
    };
  }

  async getProfilePicObjectPdf() {
    return {
      image: await this.getBase64ImageFromURL(PDF_MAKE_LOGO),
      width: 50,
      alignment: 'left'
    };
  }

  getPaymentTable() {
    return {
      table: {
        widths: ['*', '*'],
        body: [
          [
            {
              text: 'Description',
              style: 'tableHeader'
            },
            {
              text: 'Amount',
              style: 'tableHeader',
              alignment: 'right'
            }
          ],
          [
            {
              text: 'ashas' + '-' + '20/10/2021',
            },
            {
              text: '10,000' + ' /-',
              alignment: 'right'
            }
          ]
        ]
      }
    };
  }


  urlToBase64(url: string) {

    return new Promise((resolve, reject) => {
      let base64;

      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();

      xhr.addEventListener('load', () => {
        const reader = new FileReader();
        reader.readAsDataURL(xhr.response);
        reader.addEventListener('loadend', () => {
          base64 = reader.result;
          const imageBase64 = reader.result as string;
          resolve(imageBase64);
          // console.log(imageBase64);
        });
      });
    })


  }

  getBase64ImageFromURL(url): Promise<any> {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');

      img.onload = () => {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL('image/png');

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }

  dataTableForPdfMake() {
    const tableHead = [
      {
        text: 'Product',
        style: 'tableHead',
        // border: [true, true, true, true],
        fillColor: '#DEDEDE',
        borderColor: ['#eee', '#eee', '#eee', '#eee'],
      },
      {
        text: 'Quantity',
        style: 'tableHead',
        fillColor: '#DEDEDE',
        borderColor: ['#eee', '#eee', '#eee', '#eee'],
      },
      {
        text: 'Price',
        style: 'tableHead',
        fillColor: '#DEDEDE',
        borderColor: ['#eee', '#eee', '#eee', '#eee'],
      },
      {
        text: 'Total',
        style: 'tableHead',
        fillColor: '#DEDEDE',
        borderColor: ['#eee', '#eee', '#eee', '#eee'],
      },
    ];

    const finalTableBody = [tableHead];
    this.order.orderedItems.forEach(m => {
      const res = [
        {
          text: m.name,
          style: 'tableBody',
          borderColor: ['#eee', '#eee', '#eee', '#eee'],
        },
        {
          text: m.quantity,
          style: 'tableBody',
          borderColor: ['#eee', '#eee', '#eee', '#eee'],
        },
        {
          text: m.unitPrice,
          style: 'tableBody',
          borderColor: ['#eee', '#eee', '#eee', '#eee'],
        },
        {
          text: m.unitPrice * m.quantity,
          style: 'tableBody',
          borderColor: ['#eee', '#eee', '#eee', '#eee'],
        },
      ];
      // @ts-ignore
      finalTableBody.push(res)
    })

    return finalTableBody;

  }

  getItemTable() {
    return {
      table: {
        widths: ['*', 'auto', 'auto', 'auto'],
        body: this.dataTableForPdfMake()
      }
    };
  }

  getCalculationTable() {
    return {
      table: {
        widths: ['*', '*'],
        body: [
          [
            {
              text: 'SubTotal',
              style: 'tableHead',
              // border: [true, true, true, true],
              borderColor: ['#eee', '#eee', '#eee', '#eee'],
            },
            {
              text: `${this.order.subTotal} TK`,
              style: 'tableBody',
              borderColor: ['#eee', '#eee', '#eee', '#eee'],
            }
          ],
          [
            {
              text: 'Delivery Charge',
              style: 'tableHead',
              // border: [true, true, true, true],
              borderColor: ['#eee', '#eee', '#eee', '#eee'],
            },
            {
              text: `${this.order.deliveryCharge} TK`,
              style: 'tableBody',
              borderColor: ['#eee', '#eee', '#eee', '#eee'],
            }
          ],
          // [
          //   {
          //     text: 'Discount(-)',
          //     style: 'tableHead',
          //     // border: [true, true, true, true],
          //     borderColor: ['#eee', '#eee', '#eee', '#eee'],
          //   },
          //   {
          //     text: `${this.order.discount} TK`,
          //     style: 'tableBody',
          //     borderColor: ['#eee', '#eee', '#eee', '#eee'],
          //   }
          // ],
          [
            {
              text: 'Grand Total',
              style: 'tableHead',
              // border: [true, true, true, true],
              borderColor: ['#eee', '#eee', '#eee', '#eee'],
            },
            {
              text: `${this.order.grandTotal} TK`,
              style: 'tableBody',
              borderColor: ['#eee', '#eee', '#eee', '#eee'],
            }
          ],
        ]
      }
    };
  }

  get pdfMakeStyleObject(): object {
    return {
      p: {
        fontSize: 9,
      },
      pBn: {
        fontSize: 9,
        lineHeight: 2
      },
      tableHead: {
        fontSize: 9,
        bold: true,
        margin: [5, 2],
      },
      tableBody: {
        fontSize: 9,
        margin: [5, 2],
      },
      gapY: {
        margin: [0, 8]
      }

    }
  }


  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }
    if (this.subDataThree) {
      this.subDataThree.unsubscribe();
    }

    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }

    if (this.subRouteTwo) {
      this.subRouteTwo.unsubscribe();
    }
  }

}
