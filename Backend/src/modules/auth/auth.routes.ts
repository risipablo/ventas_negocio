import {Router} from 'express'
import { validateBody } from '../../middlewares/validate';
import * as authController from '../auth/auth.controller';
import { changePasswordSchema, loginSchema, registerSchema } from '../../validators/auth.schema';
import { protect } from '../../middlewares/authMiddleware';
import { validateToken } from '../auth/auth.controller';

const router = Router()


router.post('/register', validateBody(registerSchema), authController.registerUser);
router.post('/login', validateBody(loginSchema), authController.loginUser);
router.post('/logout', authController.logoutUser);
router.get('/name', protect, (req, res) => authController.userName(req as any, res));
router.get('/validate-token', (req, res) => validateToken(req as any, res));
router.put(
  '/change-password', 
  protect, 
  validateBody(changePasswordSchema), 
  authController.changePassword
);


export default router;