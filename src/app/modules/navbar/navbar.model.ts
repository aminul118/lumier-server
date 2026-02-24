import { model, Schema } from 'mongoose';
import { INavItem, INavSubItem } from './navbar.interface';

const navSubItemSchema = new Schema<INavSubItem>(
  {
    title: { type: String, required: true },
    href: { type: String, required: true },
    items: { type: [String], required: true },
    seoTitle: { type: String },
    seoDescription: { type: String },
    seoKeywords: { type: String },
  },
  {
    _id: false,
    versionKey: false,
  },
);

const navItemSchema = new Schema<INavItem>(
  {
    title: { type: String, required: true, trim: true },
    href: { type: String, required: true, trim: true },
    subItems: [navSubItemSchema],
    order: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    seoTitle: { type: String },
    seoDescription: { type: String },
    seoKeywords: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Navbar = model<INavItem>('Navbar', navItemSchema);

export { Navbar };
