import { Router } from 'express';
import { CouponControllers } from './coupon.controller';
import checkAuth from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';

const router = Router();

router.post(
  '/',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  CouponControllers.createCoupon,
);
router.get('/', CouponControllers.getAllCoupons);
router.get('/validate/:code', CouponControllers.validateCoupon);
router.get('/:id', CouponControllers.getSingleCoupon);
router.patch(
  '/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  CouponControllers.updateCoupon,
);
router.delete(
  '/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  CouponControllers.deleteCoupon,
);

export const CouponRoutes = router;
