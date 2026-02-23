import { Types } from 'mongoose';

export interface IProduct {
  _id?: Types.ObjectId;
  name: string;
  category: string;
  subCategory: string;
  type: string;
  price: number;
  image: string;
  description: string;
  details: string;
  colors: string[];
  sizes: string[];
  featured: boolean;
  rating: number;
  slug: string;
  salePrice?: number;
  soldCount?: number;
  isDeleted?: boolean;
}
