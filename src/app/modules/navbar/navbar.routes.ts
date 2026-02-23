import { Router } from 'express';
import { NavbarControllers } from './navbar.controller';
import checkAuth from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';

const router = Router();

router.post(
  '/',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  NavbarControllers.createNavbar,
);
router.get('/', NavbarControllers.getAllNavbars);
router.get('/:id', NavbarControllers.getSingleNavbar);
router.patch(
  '/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  NavbarControllers.updateNavbar,
);
router.delete(
  '/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  NavbarControllers.deleteNavbar,
);

export const NavbarRoutes = router;
