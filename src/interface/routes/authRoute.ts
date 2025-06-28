import express from 'express';
import AuthController from '../controller/authControllers';
import { authenticate } from '../../infrastructure/middleware/authMiddleware';
import { UserRepository } from '../../infrastructure/database/repositories/UserRepository';
import { AuthService } from '../../infrastructure/service/AuthService';
import { OtpRepository } from '../../infrastructure/database/repositories/OtpService';
import { EmailService } from '../../infrastructure/service/EmailService';
import { LoginGuideGoogleUseCase } from '../../application/usecase/auth/loginGuideGoogleUseCase';
import { RegisterUseCase } from '../../application/usecase/user/registerUserUseCase';
import { LoginUserUseCase } from '../../application/usecase/user/loginUser';
import { PasswordService } from '../../infrastructure/service/PasswordService';
import { RegisterGoogleUserUseCase } from '../../application/usecase/auth/RegisterGoogleUseCase';
import { GetUserProfile } from '../../application/usecase/user/GetUserProfile';
import { RefreshAccessTokenUseCase } from '../../application/usecase/auth/RefreshAccessTokenUseCase';


const router = express.Router();
const userRepo = new UserRepository();// after cleaning the code remove the user ropo from the controller and here
const authService = new AuthService(); // after cleaning remove this from controller and here
const passwordService = new PasswordService()

const loginOrRegisterUseCase = new RegisterGoogleUserUseCase(userRepo, authService);
const loginGuideGoogleUseCase = new LoginGuideGoogleUseCase(userRepo, authService);
const otpRepo = new OtpRepository();
const emailService = new EmailService();
const registerUserUseCase = new RegisterUseCase(userRepo, otpRepo, emailService);
const loginUsersUseCase = new LoginUserUseCase(userRepo, authService, passwordService);
const refreshAccessTokenUseCase = new RefreshAccessTokenUseCase(authService, userRepo)
const getUserUseCasse = new GetUserProfile(userRepo);


const authController = new AuthController(
    userRepo,
    authService,
    loginOrRegisterUseCase,
    loginGuideGoogleUseCase,
    registerUserUseCase,
    loginUsersUseCase,
    refreshAccessTokenUseCase,
    getUserUseCasse
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