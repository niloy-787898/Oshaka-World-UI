import {environment} from '../../../environments/environment';

export const DATABASE_KEY = Object.freeze({
  loginToken: 'OSAKA_TOKEN_' + environment.VERSION,
  loggInSession: 'OSAKA_SESSION_' + environment.VERSION,
  encryptAdminLogin: 'OSAKA_USER_0_' + environment.VERSION,
  encryptUserLogin: 'OSAKA_USER_1_' + environment.VERSION,
  cartsProduct: 'OSAKA_USER_CART_' + environment.VERSION,
  productFormData: 'OSAKA_PRODUCT_FORM_' + environment.VERSION,
  userCart: 'OSAKA_USER_CART_' + environment.VERSION,
  userWishList: 'OSAKA_USER_CART_' + environment.VERSION,
  recommendedProduct: 'OSAKA_RECOMMENDED_PRODUCT_' + environment.VERSION,
  userCoupon: 'OSAKA_USER_COUPON_' + environment.VERSION,
  userCookieTerm: 'OSAKA_COOKIE_TERM' + environment.VERSION,
  selectedShippingAddress: 'OSAKA_SELECTED_ADDRESS' + environment.VERSION,
  productLayout: 'OSAKA_PRODUCT_LAYOUT' + environment.VERSION,
  otpCheck: 'OSAKA_USER_OTPCHECK_' + environment.VERSION,
  loginTokenAdmin: 'OSAKA_ADMIN_TOKEN_' + environment.VERSION,
  loggInSessionAdmin: 'OSAKA_ADMIN_SESSION_' + environment.VERSION,
  loginTokenVendor: 'OSAKA_VENDOR_TOKEN_' + environment.VERSION,
  loggInSessionVendor: 'OSAKA_VENDOR_SESSION_' + environment.VERSION,
  adminRoleData: 'OSAKA_ADMIN_ROLE_' + environment.VERSION,

});
