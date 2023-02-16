import {Product} from "../../interfaces/common/product.interface";

export interface Banner {
  _id?: string;
  name: string;
  priority?: number;
  shortDesc: string;
  info?: string;
  image?: string;
  routerLink?: string;
  cardBackground?: string;
  cardBtnColor?: string;
  products: string[] | Product[];
  createdAt?: string;
  updatedAt?: string;
}
