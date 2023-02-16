import {Vendor} from './vendor';

export interface VendorIdentification {
  _id?: string;
  idType: string;
  fullName?: string;
  nidCardNo: string;
  nidCardImageFront: string;
  nidCardImageBack:string;
  businessCardImage:string;
  businessCardNo:string;
  tradeLicenseNo:string;
  tradeLicenseImage:string;
  vendorId:string;

  vendor: string | Vendor;

}
