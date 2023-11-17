import { Router } from 'express';
import { IndexController } from './controller/IndexController';
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
import { validateEmail } from './middleware/validateEmail';
import { WeatherController } from './controller/WeatherController';
import { getWeatherMiddleware } from './middleware/getWeatherData';
import { RegisterController } from './controller/RegisterController';
import { verifyUser } from './middleware/verifyUserMiddleware';

const router = Router();

router.get('/', new IndexController().info);

router.post(
  '/register',
  validateEmail,
  validatePassword,
  new RegisterController().register
);
router.post(
  '/login',
  validateEmail,
  validateLogin,
  verifyUser,
  new AuthController().login
);

router.get('/dashboard', jwtMiddleware, new DashboardController().greet);
router.get(
  '/weather',
  jwtMiddleware,
  getWeatherMiddleware,
  new WeatherController().getWeatherData
);

router.post(
  '/forgot-password',
  validateEmail,
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

router.post(
  '/forgot-password',
  validateEmail,
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

router.post(
  '/forgot-password',
  validateEmail,
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
