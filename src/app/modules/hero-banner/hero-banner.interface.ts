import { Types } from 'mongoose';

export interface IHeroBanner {
  _id?: Types.ObjectId;
  image: string;
  tag: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaHref: string;
  accentColor: string;
  bgGlow: string;
  order: number;
  isActive: boolean;
  isDeleted: boolean;
}

export interface IMiniBanner {
  _id?: Types.ObjectId;
  image: string;
  label: string;
  title: string;
  href: string;
  accent: string;
  order: number;
  isActive: boolean;
  isDeleted: boolean;
}
