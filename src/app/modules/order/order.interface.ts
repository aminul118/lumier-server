import { Types } from 'mongoose';

export enum OrderStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
}

export enum PaymentStatus {
  PAID = 'Paid',
  UNPAID = 'Unpaid',
}

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  items: IOrderItem[];
  totalPrice: number;
  status: OrderStatus;
  shippingAddress: string;
  paymentStatus: PaymentStatus;
  isDeleted?: boolean;
}
