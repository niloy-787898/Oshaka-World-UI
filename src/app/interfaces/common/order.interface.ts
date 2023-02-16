import {Product} from "./product.interface";
import {Vendor} from "./vendor";

export interface Order {
  _id: string;
  orderId: string;
  discountTypes: DiscountType[];
  name: string;
  phoneNo: string;
  email: string;
  city: string;
  shippingAddress: string;
  paymentType: string;
  orderedItems: OrderedItem[];
  subTotal: number;
  deliveryCharge: number;
  discount: number;
  totalSave?: number;
  grandTotal: number;
  checkoutDate: string;
  deliveryDate?: any;
  orderStatus: number;
  paymentStatus: string;
  hasOrderTimeline?: boolean;
  processingDate?: Date;
  shippingDate?: Date;
  deliveringDate?: Date;
  deliveryStatus: number;
  user?: string;
  coupon?: string;
  couponDiscount?: number;
  orderTimeline?: OrderTimeline;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
  refundAmount: number;
  shippingFee: number;
  totalAmount: number;
  totalAmountWithDiscount: number;
  deletedProduct: boolean;
  paymentMethod: string;
  alternativePhoneNo?: string;
  area: string;
  postCode: string;
  couponId?: string | any;
  couponValue?: number;
  vendors?: string[] | Vendor[];
  delivered?: boolean;
  hasPreorderItem?: boolean;
  orderNotes?: string;
  sessionkey?: string;
}

export interface OrderedItem {
  _id: string;
  name: string;
  slug: string;
  image: string;
  category: any;
  subCategory: any;
  brand: any;
  regularPrice: number;
  unitPrice: number;
  quantity: number;
  orderType: string;
  commission?: number;
  price: number;
  product: string | Product;
  deletedProduct?: object;
  deleteDeliveryStatus?: string;
  discountType: number;
  discountAmount?: number;
  vendor?: string;

}

export interface OrderTimeline {
  confirmed?: OrderTimelineType;
  processed?: OrderTimelineType;
  shipped?: OrderTimelineType;
  delivered?: OrderTimelineType;
  canceled?: OrderTimelineType;
  refunded?: OrderTimelineType;
}

export interface DiscountType {
  type: string;
  amount: number;
}

export interface OrderTimelineType {
  success: boolean;
  date?: Date;
  expectedDate?: Date;
}
