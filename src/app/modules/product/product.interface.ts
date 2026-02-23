import { Types } from 'mongoose';

export interface IProduct {
  _id?: Types.ObjectId;
  name: string;
  category: string;
  subCategory: string;
  type: string;
  price: number;
  image: string;
  images?: string[];
  description: string;
  details: string;
  colors: string[];
  sizes: string[];
  featured: boolean;
  rating: number;
  slug: string;
  buyPrice: number;
  stock: number;
  salePrice?: number;
  soldCount?: number;
  isDeleted?: boolean;
}
