import { Types } from 'mongoose';

export interface ICoupon {
  _id?: Types.ObjectId;
  name: string;
  code: string;
  discount: number;
  expiryDate: Date;
  isDeleted: boolean;
}
