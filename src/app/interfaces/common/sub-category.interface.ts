import {Category} from './category.interface';
import {ProductAttribute} from "./product-attribute";

export interface SubCategory {
  _id?: string;
  readOnly?: boolean;
  category?: string | Category;
  categoryInfo?: Category;
  name?: string;
  slug?: string;
  image?: string;
  priority?: number;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
  attributes: string[] |  ProductAttribute[];
}
