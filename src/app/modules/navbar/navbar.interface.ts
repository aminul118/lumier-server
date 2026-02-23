import { Types } from 'mongoose';

export interface INavSubItem {
  title: string;
  items: string[];
}

export interface INavItem {
  _id?: Types.ObjectId;
  title: string;
  href: string;
  subItems?: INavSubItem[];
  order: number;
  isDeleted?: boolean;
}
