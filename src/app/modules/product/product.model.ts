import { model, Schema } from 'mongoose';
import { IProduct } from './product.interface';

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    subCategory: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    details: { type: String, default: '' },
    colors: { type: [String], required: true },
    sizes: { type: [String], required: true },
    featured: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    slug: { type: String, required: true, unique: true, trim: true },
    salePrice: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Product = model<IProduct>('Product', productSchema);

export { Product };
