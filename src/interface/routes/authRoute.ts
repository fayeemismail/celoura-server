import express from 'express';
import AuthController from '../controller/authControllers';
import { authenticate } from '../../infrastructure/middleware/authMiddleware';
import { UserRepository } from '../../infrastructure/database/repositories/UserRepository';
import { AuthService } from '../../infrastructure/service/AuthService';
import { OtpRepository } from '../../infrastructure/database/repositories/OtpService';
import { EmailService } from '../../infrastructure/service/EmailService';
import { PasswordService } from '../../infrastructure/service/PasswordService';
import { RegisterGoogleUserUseCase } from '../../application/usecase/auth/RegisterGoogleUseCase';
import { GetUserProfile } from '../../application/usecase/user/GetUserProfile';
import { RefreshAccessTokenUseCase } from '../../application/usecase/auth/RefreshAccessTokenUseCase';
import { LoginGuideGoogleUseCase } from '../../application/usecase/auth/LoginGuideGoogleUseCase';
import { RegisterUseCase } from '../../application/usecase/user/RegisterUserUseCase';
import { LoginUserUseCase } from '../../application/usecase/user/LoginUser';
import { ResendOtpUseCase } from '../../application/usecase/auth/ResendOtp';
import { VerifyOtpUseCase } from '../../application/usecase/auth/VerifyOtp';
import { ForgotPasswordUseCase } from '../../application/usecase/auth/ForgotPasswordUseCase';
import { ForgotPasswordService } from '../../infrastructure/service/ForgotPasswordService';
import { VerifyForgotPasswordOtpUseCse } from '../../application/usecase/auth/VerifyForgotPasswordOtpUseCase';
import { ResentForgotPasswordUsecase } from '../../application/usecase/auth/ResentForgotPasswordUseCase';
import { ChangeForgotPasswordUseCase } from '../../application/usecase/auth/ChangeForgotPassword';


const router = express.Router();


const userRepo = new UserRepository();// after cleaning the code remove the user ropo from the controller and here
const authService = new AuthService(); // after cleaning remove this from controller and here
const passwordService = new PasswordService();
const otpRepo = new OtpRepository();
const emailService = new EmailService();
const forgotPasswordService = new ForgotPasswordService(otpRepo, emailService)

// usecase
const loginOrRegisterUseCase = new RegisterGoogleUserUseCase(userRepo, authService);
const loginGuideGoogleUseCase = new LoginGuideGoogleUseCase(userRepo, authService);
const registerUserUseCase = new RegisterUseCase(userRepo, otpRepo, emailService);
const loginUsersUseCase = new LoginUserUseCase(userRepo, authService, passwordService);
const refreshAccessTokenUseCase = new RefreshAccessTokenUseCase(authService, userRepo)
const getUserUseCasse = new GetUserProfile(userRepo);
const resendOtpUseCase = new ResendOtpUseCase(otpRepo, emailService);
const verifyOtpUseCase = new VerifyOtpUseCase(otpRepo, userRepo, passwordService);
const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepo, forgotPasswordService);
const verifyForgotPassOtpUseCase = new VerifyForgotPasswordOtpUseCse(otpRepo);
const resentForgotPasswOtpUseCase = new ResentForgotPasswordUsecase(userRepo, forgotPasswordService, otpRepo);
const changeForgotPasswordUseCase = new ChangeForgotPasswordUseCase(userRepo, passwordService);


const authController = new AuthController(
    loginOrRegisterUseCase,
    loginGuideGoogleUseCase,
    registerUserUseCase,
    loginUsersUseCase,
    refreshAccessTokenUseCase,
    getUserUseCasse,
    resendOtpUseCase,
    verifyOtpUseCase,
    forgotPasswordUseCase,
    verifyForgotPassOtpUseCase,
    resentForgotPasswOtpUseCase,
    changeForgotPasswordUseCase
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

//forgot password
router.post('/forgot-password-email', authController.requestPasswordReset);
router.post('/forgot-password/verifytp', authController.verifyForgotPassOtp);
router.put('/forgotpassword/resendOtp', authController.resentForgotPasswordOtp);
router.put('/changePassword', authController.changeForgotPassword);

export default router;