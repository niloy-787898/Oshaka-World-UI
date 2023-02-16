import {Tag} from './tag.interface';
import {Variation, VariationOption} from './variation.interface';
import {ProductAttribute} from "./product-attribute";


export interface Product {
  _id?: string;
  name: string;
  slug?: string;
  slug2?: string;
  description?: string;
  costPrice?: number;
  salePrice: number;
  hasTax?: boolean;
  tax?: number;
  sku: string;
  emiMonth?: number[];
  discountType?: number;
  discountAmount?: number;
  images?: string[];
  trackQuantity?: boolean;
  quantity?: number;
  category?: CatalogInfo;
  subCategory?: CatalogInfo;
  brand?: CatalogInfo;
  tags?: string[] | Tag[];
  specifications?: ProductSpecification[];
  hasVariations?: boolean;
  variations?: Variation[];
  variationsOptions?: VariationOption[];
  status?: string;
  videoUrl?: string;
  unit?: string;
  filterData: FilterData[];
  attributes: string[] | ProductAttribute[];
  ratingReview: any[];
  productName: string;
  productSlug: string;
  // Seo
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  // Point
  earnPoint?: boolean;
  pointType?: number;
  pointValue?: number;
  redeemPoint?: boolean;
  redeemType?: number;
  redeemValue?: number;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
  selectedQty?: number;
  // For Create Order
  orderVariationOption?: VariationOption;
  orderVariation?: string;

  // For Offer
  offerDiscountAmount?: number;
  offerDiscountType?: number;
  resetDiscount?: boolean;
}

export interface CatalogInfo {
  _id: string;
  name: string;
  slug: string;
}

export interface ProductFilterGroup {
  categories: GroupCategory[];
  subCategories: GroupSubCategory[];
  brands: BrandSubCategory[];
}

interface GroupCategory {
  _id: {
    category: string
  },
  name: string;
  slug: string;
  total: number;
  select?: boolean;
}

interface GroupSubCategory {
  _id: {
    subCategory: string
  },
  name: string;
  slug: string;
  total: number;
  select?: boolean;
}

interface BrandSubCategory {
  _id: {
    brand: string
  },
  name: string;
  slug: string;
  total: number;
  select?: boolean;
}


export interface ProductSpecification {
  name?: string;
  value?: string;
}

export interface FilterData {
  _id: string;
  attributeName: string;
  attributeValues: string;
}
