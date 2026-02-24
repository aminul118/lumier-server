import { ISiteSetting } from './site-setting.interface';
import { SiteSetting } from './site-setting.model';
import { deleteFileFromCloudinary } from '../../config/cloudinary.config';

const getSiteSettingFromDB = async () => {
  let result = await SiteSetting.findOne();
  if (!result) {
    // Create default settings if not exists
    result = await SiteSetting.create({
      logo: 'https://res.cloudinary.com/dzt89p03q/image/upload/v1740342345/lumiere-logo.png', // Temporary default
      socialLinks: [
        { platform: 'Facebook', url: 'https://facebook.com', isActive: true },
        { platform: 'WhatsApp', url: 'https://wa.me', isActive: true },
        { platform: 'Telegram', url: 'https://t.me', isActive: true },
        { platform: 'LinkedIn', url: 'https://linkedin.com', isActive: true },
        { platform: 'X', url: 'https://x.com', isActive: true },
        { platform: 'YouTube', url: 'https://youtube.com', isActive: true },
        { platform: 'Instagram', url: 'https://instagram.com', isActive: true },
        { platform: 'GitHub', url: 'https://github.com', isActive: true },
      ],
    });
  }
  return result;
};

const updateSiteSettingIntoDB = async (payload: Partial<ISiteSetting>) => {
  const currentSettings = await SiteSetting.findOne();

  if (
    payload.logo &&
    currentSettings?.logo &&
    payload.logo !== currentSettings.logo
  ) {
    // Delete previous logo from cloudinary
    try {
      await deleteFileFromCloudinary(currentSettings.logo);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete old logo from Cloudinary:', error);
    }
  }

  const result = await SiteSetting.findOneAndUpdate({}, payload, {
    new: true,
    upsert: true,
    runValidators: true,
  });

  return result;
};

export const SiteSettingServices = {
  getSiteSettingFromDB,
  updateSiteSettingIntoDB,
};
