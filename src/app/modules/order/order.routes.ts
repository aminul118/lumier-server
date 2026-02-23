import { Router } from 'express';
import { OrderControllers } from './order.controller';
import checkAuth from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';

const router = Router();

router.post('/', checkAuth(Role.USER), OrderControllers.createOrder);
router.get(
  '/',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  OrderControllers.getAllOrders,
);
router.get(
  '/my-orders',
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  OrderControllers.getMyOrders,
);
router.get(
  '/:id',
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  OrderControllers.getSingleOrder,
);
router.patch(
  '/update-status/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  OrderControllers.updateOrderStatus,
);

export const OrderRoutes = router;
