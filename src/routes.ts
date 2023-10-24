import { Router } from 'express';
import { HomeController } from './controller/HomeController';
import { AuthController } from './controller/AuthController';
import { DashboardController } from './controller/DashboardController';
import { jwtMiddleware } from './middleware/jwtMiddleware';
import { validateLogin } from './middleware/validateLogin';
import { validatePassword } from './middleware/validatePassword';
const router = Router();

router.get('/', new HomeController().hello);
router.post(
  '/login',
  validatePassword,
  validateLogin,
  new AuthController().login
);
router.get('/dashboard', jwtMiddleware, new DashboardController().greet);

export default router;
