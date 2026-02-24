import { model, Schema } from 'mongoose';
import { ISiteSetting, ISocialLink } from './site-setting.interface';

const socialLinkSchema = new Schema<ISocialLink>(
  {
    platform: { type: String, required: true },
    url: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { _id: false },
);

const siteSettingSchema = new Schema<ISiteSetting>(
  {
    logo: { type: String, required: true },
    socialLinks: [socialLinkSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const SiteSetting = model<ISiteSetting>(
  'SiteSetting',
  siteSettingSchema,
);
