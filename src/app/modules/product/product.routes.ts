import { Router } from 'express';
import { ProductControllers } from './product.controller';
import checkAuth from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';

import { multerUpload } from '../../config/multer.config';

const router = Router();

router.post(
  '/',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.any(),
  ProductControllers.createProduct,
);
router.get('/', ProductControllers.getAllProducts);
router.get('/:id', ProductControllers.getSingleProduct);
router.patch(
  '/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.any(),
  ProductControllers.updateProduct,
);
router.delete(
  '/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ProductControllers.deleteProduct,
);

export const ProductRoutes = router;
