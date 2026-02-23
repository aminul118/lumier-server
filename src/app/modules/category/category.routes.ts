import { Router } from 'express';
import { CategoryControllers } from './category.controller';
import checkAuth from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';

const router = Router();

router.post(
  '/',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  CategoryControllers.createCategory,
);
router.get('/', CategoryControllers.getAllCategories);
router.get('/:id', CategoryControllers.getSingleCategory);
router.patch(
  '/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  CategoryControllers.updateCategory,
);
router.delete(
  '/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  CategoryControllers.deleteCategory,
);

export const CategoryRoutes = router;
