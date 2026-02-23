import { model, Schema } from 'mongoose';
import { ICategory, ISubCategory } from './category.interface';

const subCategorySchema = new Schema<ISubCategory>(
  {
    title: { type: String, required: true },
    items: { type: [String], required: true },
  },
  {
    _id: false,
    versionKey: false,
  },
);

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    subCategories: [subCategorySchema],
    colors: [String],
    sizes: [String],
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Category = model<ICategory>('Category', categorySchema);

export { Category };
