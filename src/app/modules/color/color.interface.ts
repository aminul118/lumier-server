import { Types } from 'mongoose';

export interface IColor {
  _id?: Types.ObjectId;
  name: string;
  hex?: string;
  isDeleted?: boolean;
}
