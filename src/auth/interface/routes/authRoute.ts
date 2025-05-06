import express from 'express';
import { 
    adminLogin, 
    getCurrentUser, 
    login, 
    logout, 
    refreshAccessToken, 
    resendOtp, 
    signup, 
    verifyOtp } from '../controllers/authControllers';
import { authenticate } from '../../infrastructure/middleware/authMiddleware';

const router = express.Router();



router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/admin/login', adminLogin);
router.post('/refresh-token', refreshAccessToken);
// router.get('/getUser', authenticate, getCurrentUser);
router.post('/logout', logout);



export default router;