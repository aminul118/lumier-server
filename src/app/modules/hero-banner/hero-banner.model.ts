import { model, Schema } from 'mongoose';
import { IHeroBanner, IMiniBanner } from './hero-banner.interface';

const heroBannerSchema = new Schema<IHeroBanner>(
  {
    image: { type: String, required: true, trim: true },
    tag: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    cta: { type: String, required: true, trim: true },
    ctaHref: { type: String, required: true, trim: true },
    accentColor: { type: String, required: true, trim: true },
    bgGlow: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const miniBannerSchema = new Schema<IMiniBanner>(
  {
    image: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    href: { type: String, required: true, trim: true },
    accent: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const HeroBanner = model<IHeroBanner>('HeroBanner', heroBannerSchema);
const MiniBanner = model<IMiniBanner>('MiniBanner', miniBannerSchema);

export { HeroBanner, MiniBanner };
