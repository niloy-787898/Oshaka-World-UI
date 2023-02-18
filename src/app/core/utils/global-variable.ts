import {environment} from '../../../environments/environment';

export const DATABASE_KEY = Object.freeze({
  loginToken: 'HERIKEN_TOKEN_' + environment.VERSION,
  loggInSession: 'HERIKEN_SESSION_' + environment.VERSION,
  encryptAdminLogin: 'HERIKEN_USER_0_' + environment.VERSION,
  encryptUserLogin: 'HERIKEN_USER_1_' + environment.VERSION,
  cartsProduct: 'HERIKEN_USER_CART_' + environment.VERSION,
  productFormData: 'HERIKEN_PRODUCT_FORM_' + environment.VERSION,
  userCart: 'HERIKEN_USER_CART_' + environment.VERSION,
  userWishList: 'HERIKEN_USER_CART_' + environment.VERSION,
  recommendedProduct: 'HERIKEN_RECOMMENDED_PRODUCT_' + environment.VERSION,
  userCoupon: 'HERIKEN_USER_COUPON_' + environment.VERSION,
  userCookieTerm: 'HERIKEN_COOKIE_TERM' + environment.VERSION,
  selectedShippingAddress: 'HERIKEN_SELECTED_ADDRESS' + environment.VERSION,
  productLayout: 'HERIKEN_PRODUCT_LAYOUT' + environment.VERSION,
  otpCheck: 'HERIKEN_USER_OTPCHECK_' + environment.VERSION,
  loginTokenAdmin: 'HERIKEN_ADMIN_TOKEN_' + environment.VERSION,
  loggInSessionAdmin: 'HERIKEN_ADMIN_SESSION_' + environment.VERSION,
  loginTokenVendor: 'HERIKEN_VENDOR_TOKEN_' + environment.VERSION,
  loggInSessionVendor: 'HERIKEN_VENDOR_SESSION_' + environment.VERSION,
  adminRoleData: 'HERIKEN_ADMIN_ROLE_' + environment.VERSION,

});
