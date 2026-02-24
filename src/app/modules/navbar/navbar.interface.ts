import { Types } from 'mongoose';

export interface INavSubItem {
  title: string;
  href: string;
  items: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

export interface INavItem {
  _id?: Types.ObjectId;
  title: string;
  href: string;
  subItems?: INavSubItem[];
  order: number;
  isDeleted?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}
