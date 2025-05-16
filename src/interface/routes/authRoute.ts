import express from 'express';
import AuthController from '../controller/authControllers';
import { authenticate } from '../../infrastructure/middleware/authMiddleware';

const router = express.Router();
const authController = new AuthController();

//sugnup routes
router.post('/signup', authController.signup);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);

//login routes
router.post('/login', authController.login);
router.post('/admin/login', authController.adminLogin);
router.post('/guide/login', authController.guideLogin);

//loguout routes
router.post('/logout', authController.logoutUser);
router.post('/adminLogout', authController.adminLogout);
router.post('/guide/logout', authController.guideLogout);

//token checking routes.
router.post('/refresh-token', authController.refreshAccessToken);
router.get('/me',   authenticate, authController.getCurrentUser);


export default router;