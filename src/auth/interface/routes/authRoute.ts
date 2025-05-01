import express from 'express';
import { login, resendOtp, signup, verifyOtp } from '../controllers/authControllers';

const router = express.Router();



router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp)

export default router;