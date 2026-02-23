import { Types } from 'mongoose';

export interface ISubCategory {
  title: string;
  items: string[];
}

export interface ICategory {
  _id?: Types.ObjectId;
  name: string;
  subCategories: ISubCategory[];
  colors: string[];
  sizes: string[];
  isDeleted?: boolean;
}
