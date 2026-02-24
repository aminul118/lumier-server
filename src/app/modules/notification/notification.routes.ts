import { Router } from 'express';
import checkAuth from '../../middlewares/checkAuth';
import { NotificationControllers } from './notification.controller';

const router = Router();

router.get(
  '/my-notifications',
  checkAuth('ADMIN', 'SUPER_ADMIN', 'USER'),
  NotificationControllers.getMyNotifications,
);
router.patch(
  '/mark-read/:id',
  checkAuth('ADMIN', 'SUPER_ADMIN', 'USER'),
  NotificationControllers.markAsRead,
);
router.patch(
  '/mark-all-read',
  checkAuth('ADMIN', 'SUPER_ADMIN', 'USER'),
  NotificationControllers.markAllAsRead,
);
router.delete(
  '/clear-all',
  checkAuth('ADMIN', 'SUPER_ADMIN', 'USER'),
  NotificationControllers.clearAll,
);

export const NotificationRoutes = router;
