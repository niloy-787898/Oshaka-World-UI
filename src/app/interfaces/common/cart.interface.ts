import { Product } from "./product.interface";
import {User} from './user.interface';

export interface Cart {
  _id?: string;
  product?: string | Product;
  user?: string | User;
  selectedQty?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
