import {SubCategory} from './sub-category.interface';

export interface CategoryMenu {
  _id?: string;
  name?: string;
  slug?: string;
  subCategories?: SubCategory[]
}
