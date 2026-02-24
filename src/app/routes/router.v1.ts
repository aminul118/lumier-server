import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.routes';
import { AuthRouter } from '../modules/auth/auth.route';
import { OTPRouter } from '../modules/otp/otp.route';
import { IModuleRoutes } from '../types';
import { ContactRouter } from '../modules/contact/contact.route';
import { StatsRouter } from '../modules/stats/stats.routes';
import { CategoryRoutes } from '../modules/category/category.routes';
import { ColorRoutes } from '../modules/color/color.routes';
import { ProductRoutes } from '../modules/product/product.routes';
import { OrderRoutes } from '../modules/order/order.routes';
import { NavbarRoutes } from '../modules/navbar/navbar.routes';
import { CouponRoutes } from '../modules/coupon/coupon.routes';
import {
  HeroBannerRoutes,
  MiniBannerRoutes,
} from '../modules/hero-banner/hero-banner.routes';
import { NotificationRoutes } from '../modules/notification/notification.routes';

const router = Router();

const moduleRoutes: IModuleRoutes[] = [
  {
    path: '/user',
    element: UserRoutes,
  },
  {
    path: '/auth',
    element: AuthRouter,
  },
  {
    path: '/otp',
    element: OTPRouter,
  },
  {
    path: '/contact',
    element: ContactRouter,
  },
  {
    path: '/stats',
    element: StatsRouter,
  },
  {
    path: '/categories',
    element: CategoryRoutes,
  },
  {
    path: '/colors',
    element: ColorRoutes,
  },
  {
    path: '/products',
    element: ProductRoutes,
  },
  {
    path: '/orders',
    element: OrderRoutes,
  },
  {
    path: '/navbar',
    element: NavbarRoutes,
  },
  {
    path: '/coupons',
    element: CouponRoutes,
  },
  {
    path: '/hero-banners',
    element: HeroBannerRoutes,
  },
  {
    path: '/mini-banners',
    element: MiniBannerRoutes,
  },
  {
    path: '/notifications',
    element: NotificationRoutes,
  },
];

moduleRoutes.forEach((r) => {
  router.use(r.path, r.element);
});

export const routerV1 = router;
