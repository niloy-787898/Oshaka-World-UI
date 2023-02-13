import {Address} from './address.interface';
import {Cart} from './cart.interface';
import {Coupon} from "./coupon.interface";
import {Order} from "./order.interface";

export interface User {

  _id?: string;
  fullName: string;
  name?:string;
  username?: string;
  gender?: string;
  birthdate?: Date;
  email?: string;
  phoneNo?: string;
  address?: string;
  profileImg?: string;
  password?: string;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  registrationType?: string;
  registrationAt?: Date;
  hasAccess?: boolean;
  usedCoupons?: Coupon[] | string[];
  wishlists?: string[];
  carts?: Cart[] | string[];
  checkouts?: Order[] | string[];
  addresses?: Address[] | string[];
  createdAt?: any;
  updatedAt?: any;
}

export interface UserAuthResponse {
  success: boolean;
  token?: string;
  tokenExpiredIn?: number;
  data?: any;
  message?: string;
}

export interface UserJwtPayload {
  _id?: string;
  username: string;
}
