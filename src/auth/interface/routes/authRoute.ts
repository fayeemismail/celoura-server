import express from 'express';
import { 
    // adminLogin, 
    login, 
    resendOtp, 
    signup, 
    verifyOtp } from '../controllers/authControllers';

const router = express.Router();



router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
// router.post('/admin/login', adminLogin)

export default router;