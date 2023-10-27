import { Router } from 'express';
import { HomeController } from './controller/HomeController';
import { AuthController } from './controller/AuthController';
import { DashboardController } from './controller/DashboardController';
import { ForgotPasswordController } from './controller/ForgotPasswordController';
import { ResetPasswordController } from './controller/ResetPasswordController';
import { jwtMiddleware } from './middleware/jwtMiddleware';
import { validateLogin } from './middleware/validateLogin';
import { validatePassword } from './middleware/validatePassword';
import { searchEmail } from './middleware/searchEmail';
import { searchID } from './middleware/searchID';
import { verifyResetToken } from './middleware/verifyResetToken';

const router = Router();

router.get('/', new HomeController().info);

router.post(
  '/login',
  validatePassword,
  validateLogin,
  new AuthController().login
);

router.get('/dashboard', jwtMiddleware, new DashboardController().greet);

router.post(
  '/forgot-password',
  searchEmail,
  new ForgotPasswordController().forgotPassword
);

router.get(
  '/reset-password/:id/:resetToken',
  searchID,
  verifyResetToken,
  new ResetPasswordController().getResetToken
);

router.post(
  '/reset-password',
  validatePassword,
  searchID,
  verifyResetToken,
  new ResetPasswordController().resetPassword
);

export default router;
