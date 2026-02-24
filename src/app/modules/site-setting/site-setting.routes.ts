import { Router } from 'express';
import checkAuth from '../../middlewares/checkAuth';
import { SiteSettingControllers } from './site-setting.controller';
import { multerUpload } from '../../config/multer.config';
import { Role } from '../user/user.interface';

const router = Router();

router.get('/', SiteSettingControllers.getSiteSetting);

router.patch(
  '/',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'baseImage', maxCount: 1 },
  ]),
  SiteSettingControllers.updateSiteSetting,
);

export const SiteSettingRoutes = router;
