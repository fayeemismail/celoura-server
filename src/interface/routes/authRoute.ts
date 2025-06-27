import express from 'express';
import AuthController from '../controller/authControllers';
import { authenticate } from '../../infrastructure/middleware/authMiddleware';
import { UserRepository } from '../../infrastructure/database/repositories/UserRepository';
import { AuthService } from '../../infrastructure/service/AuthService';
import { OtpRepository } from '../../infrastructure/database/repositories/OtpService';
import { EmailService } from '../../infrastructure/service/EmailService';
import { loginUserUseCase } from '../../application/usecase/auth/loginUserUseCase';
import { LoginGuideGoogleUseCase } from '../../application/usecase/auth/loginGuideGoogleUseCase';
import { RegisterUseCase } from '../../application/usecase/user/registerUserUseCase';
import { LoginUserUseCase } from '../../application/usecase/user/loginUser';
import { PasswordService } from '../../infrastructure/service/PasswordService';


const router = express.Router();
const userRepo = new UserRepository();// after cleaning the code remove the user ropo from the controller and here
const authService = new AuthService(); // after cleaning remove this from controller and here
const passwordService = new PasswordService()

const loginOrRegisterUseCase = new loginUserUseCase();
const loginGuideGoogleUseCase = new LoginGuideGoogleUseCase();
const otpRepo = new OtpRepository();
const emailService = new EmailService();
const registerUserUseCase = new RegisterUseCase(userRepo, otpRepo, emailService);
const loginUsersUseCase = new LoginUserUseCase(userRepo, authService, passwordService)


const authController = new AuthController(
    userRepo,
    authService,
    loginOrRegisterUseCase,
    loginGuideGoogleUseCase,
    registerUserUseCase,
    loginUsersUseCase
);

//sugnup routes.
router.post('/signup', authController.signup);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);

//login routes.
router.post('/login', authController.login);
router.post('/admin/login', authController.adminLogin);
router.post('/guide/login', authController.guideLogin);

//loguout routes.
router.post('/logout', authController.logoutUser);
router.post('/adminLogout', authController.adminLogout);
router.post('/guide/logout', authController.guideLogout);

//token checking routes.
router.post('/refresh-token', authController.refreshAccessToken);
router.get('/me',   authenticate, authController.getCurrentUser);

//For Login User With Google
router.post('/google-login', authController.googleLoginVerify);

//For Login Guide With Google 
router.post('/guide-google-login', authController.googleVerifyGuide);

export default router;