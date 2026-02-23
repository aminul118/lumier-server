import { Router } from 'express';
import { ColorControllers } from './color.controller';
import checkAuth from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';

const router = Router();

router.post(
  '/',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ColorControllers.createColor,
);
router.get('/', ColorControllers.getAllColors);
router.get('/:id', ColorControllers.getSingleColor);
router.patch(
  '/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ColorControllers.updateColor,
);
router.delete(
  '/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ColorControllers.deleteColor,
);

export const ColorRoutes = router;
