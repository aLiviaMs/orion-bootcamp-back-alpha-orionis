import { Router } from 'express';
import { HomeController } from './controller/HomeController';
import { AuthController } from './controller/AuthController';
import { DashboardController } from './controller/DashboardController';
import { jwtMiddleware } from './middleware/jwtMiddleware';

const router = Router();

router.get('/', new HomeController().hello);
router.post('/login', new AuthController().login);
router.get('/dashboard', jwtMiddleware, new DashboardController().greet);

export default router;
