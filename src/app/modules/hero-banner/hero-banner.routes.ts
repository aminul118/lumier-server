import { Router } from 'express';
import {
  HeroBannerControllers,
  MiniBannerControllers,
} from './hero-banner.controller';
import checkAuth from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';

// ─── Hero Banner Routes ───────────────────────────────────────────────────────
const heroBannerRouter = Router();

heroBannerRouter.post(
  '/',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  HeroBannerControllers.createHeroBanner,
);
heroBannerRouter.get('/', HeroBannerControllers.getAllHeroBanners);
heroBannerRouter.get('/:id', HeroBannerControllers.getSingleHeroBanner);
heroBannerRouter.patch(
  '/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  HeroBannerControllers.updateHeroBanner,
);
heroBannerRouter.delete(
  '/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  HeroBannerControllers.deleteHeroBanner,
);

// ─── Mini Banner Routes ───────────────────────────────────────────────────────
const miniBannerRouter = Router();

miniBannerRouter.post(
  '/',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  MiniBannerControllers.createMiniBanner,
);
miniBannerRouter.get('/', MiniBannerControllers.getAllMiniBanners);
miniBannerRouter.get('/:id', MiniBannerControllers.getSingleMiniBanner);
miniBannerRouter.patch(
  '/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  MiniBannerControllers.updateMiniBanner,
);
miniBannerRouter.delete(
  '/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  MiniBannerControllers.deleteMiniBanner,
);

export const HeroBannerRoutes = heroBannerRouter;
export const MiniBannerRoutes = miniBannerRouter;
