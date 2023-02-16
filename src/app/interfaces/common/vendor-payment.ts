
import { Vendor } from "./vendor";
import {Admin} from "./admin";

export interface VendorPayment {
  _id?: string;
  vendor?: string | Vendor;
  date?: string;
  dateString?: string;
  amount?: number;
  paymentMethod?: string;
  paymentMethodId?: string;
  paymentBy?: string | Admin;
  status?: string; // "pending" / "accepted" / "not_accepted"
  createdAt?: Date;
  updatedAt?: Date;
}
