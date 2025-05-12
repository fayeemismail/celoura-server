import { Request, Response, NextFunction } from "express";
import IAuthController from "../../domain/interfaces/IAuthController";
import { AuthService } from "../../infrastructure/service/AuthService";
import { OtpService } from "../../infrastructure/service/OtpService";
import { EmailService } from "../../infrastructure/service/EmailService";
import { registerUser } from "../../application/usecase/user/registerUser";
import { sendSignupOtp } from "../../application/usecase/user/sendSignupOtp";
import { loginUser } from "../../application/usecase/user/loginUser";
import { UserRepository } from "../../infrastructure/database/repositories/UserRepository";
import { env } from "../../config/authConfig";
import jwt, { JwtPayload } from "jsonwebtoken";
import { HTTP_STATUS } from "../../application/constants/httpStatus";

export default class AuthController implements IAuthController {
    private userRepo = new UserRepository();
    private authService = new AuthService();
    private otpService = new OtpService();
    private emailService = new EmailService();

    public signup = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const { name, email, password, confirmPassword, role } = req.body;
            const existingUser = await this.userRepo.findByEmail(email);
            if (existingUser) return res.status(400).json({ error: 'User already Exists' });
            if (password !== confirmPassword) {
                return res.status(400).json({ error: 'Invalid Credentials' });
            }

            await this.otpService.setTempUser(email, { name, email, confirmPassword, role });
            await sendSignupOtp(email, this.otpService, this.emailService);
            res.status(200).json({ message: 'OTP sent to Email' });
        } catch (error: any) {
            console.log(error.message);
            res.status(400).json({ error: error.message });
        }
    };

    public login = async (req: Request, res: Response): Promise<any> => {
        try {
            const { email, password } = req.body;
            const { user, token, refreshToken } = await loginUser(email, password, ['user'], this.userRepo, this.authService);

            res.cookie('accessToken', token, {
                httpOnly: true,
                secure: env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: env.ACCESS_TOKEN_EXPIRE,
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: env.REFRESH_TOKEN_EXPIRE,
            });

            res.status(200).json(user);
        } catch (error: any) {
            console.error('Login Error:', error);
            res.status(400).json({ error: error.message });
        }
    };

    public logoutUser = (req: Request, res: Response): void => {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "strict",
            secure: env.NODE_ENV === "production",
        });

        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: "strict",
            secure: env.NODE_ENV === "production",
        });

        res.status(200).json({ message: "Logged out successfully" });
    };

    public adminLogin = async (req: Request, res: Response): Promise<any> => {
        try {
            const { email, password } = req.body;
            const { user, token, refreshToken } = await loginUser(email, password, ['admin'], this.userRepo, this.authService);

            res.clearCookie('adminRefreshToken', { path: '/admin' });

            res.cookie('adminAccessToken', token, {
                httpOnly: true,
                sameSite: 'strict',
                secure: env.NODE_ENV === 'production',
                maxAge: env.ACCESS_TOKEN_EXPIRE,
                path: '/',
            });

            res.cookie('adminRefreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'strict',
                secure: env.NODE_ENV === 'production',
                maxAge: env.REFRESH_TOKEN_EXPIRE,
                path: '/',
            });

            res.status(200).json(user);
        } catch (error: any) {
            console.error("Login Error:", error);
            res.status(400).json({ error: error.message });
        }
    };

    public adminLogout = (req: Request, res: Response): void => {
        res.clearCookie('adminAccessToken', {
            httpOnly: true,
            sameSite: 'strict',
            secure: env.NODE_ENV === 'production',
        });

        res.clearCookie('adminRefreshToken', {
            httpOnly: true,
            sameSite: 'strict',
            secure: env.NODE_ENV === 'production',
        });

        res.status(HTTP_STATUS.OK.code).json({ message: "Admin logged out successfully" });
    };

    public guideLogin = async (req: Request, res: Response): Promise<any> => {
        try {
            const { email, password } = req.body;
            const { user, token, refreshToken } = await loginUser(email, password, ['guide'], this.userRepo, this.authService);

            res.clearCookie('guideRefreshToken', { path: '/guide' });

            res.cookie('guideAccessToken', token, {
                httpOnly: true,
                sameSite: 'strict',
                secure: env.NODE_ENV === 'production',
                maxAge: env.ACCESS_TOKEN_EXPIRE,
                path: '/'
            });

            res.cookie('guideRefreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'strict',
                secure: env.NODE_ENV === 'production',
                maxAge: env.REFRESH_TOKEN_EXPIRE,
                path: '/'
            });

            res.status(200).json(user);
        } catch (error: any) {
            console.log("Login Error: ", error);
            res.status(HTTP_STATUS.BAD_REQUEST.code).json({ error: error.message })
        }

    }

    public guideLogout = (req: Request, res: Response): void => {
        res.clearCookie('guideAccessToken', {
            httpOnly: true,
            sameSite: 'strict',
            secure: env.NODE_ENV === 'production'
        });

        res.clearCookie('guideRefreshToken', {
            httpOnly: true,
            sameSite: 'strict',
            secure: env.NODE_ENV === 'production'
        });

        res.status(HTTP_STATUS.OK.code).json({ message: 'guide Logged Out successfully' });

    }

    public refreshAccessToken = (req: Request, res: Response): any => {
        const token = req.cookies?.refreshToken;
        if (!token) return res.status(401).json({ error: 'Refresh Token is missing' });

        try {
            const payload = jwt.verify(token, env.JWT_REFRESH_SECRET!) as JwtPayload;
            if (!payload || typeof payload === 'string' || !payload.id) {
                return res.status(403).json({ error: "Invalid token payload" });
            }

            const newAccessToken = jwt.sign({ id: payload.id }, env.JWT_ACCESS_SECRET!, {
                expiresIn: '15m',
            });

            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: env.ACCESS_TOKEN_EXPIRE,
            });

            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Refresh Error: ', error);
            res.status(403).json({ error: "Invalid refresh token" });
        }
    };

    public verifyOtp = async (req: Request, res: Response): Promise<any> => {
        const { email, otp } = req.body;

        const savedOtp = await this.otpService.getOtp(email);
        if (!savedOtp) {
            return res.status(400).json({ message: "OTP expired or invalid" });
        }

        if (savedOtp !== otp) {
            return res.status(400).json({ message: "Incorrect OTP" });
        }

        const userData = await this.otpService.getTempUser(email);
        if (!userData) {
            return res.status(400).json({ message: "Session expired please signup again" });
        }

        const user = await registerUser(userData.name, userData.email, userData.confirmPassword, userData.role, this.userRepo, this.authService);

        await this.otpService.deleteOtp(email);
        await this.otpService.deleteTempUser(email);

        res.status(201).json({ user, message: "User registered successfully" });
    };

    public resendOtp = async (req: Request, res: Response): Promise<any> => {
        const { email } = req.body;

        const otp = await this.otpService.getOtp(email);
        if (otp) {
            await this.otpService.deleteOtp(email);
        }

        const user = await this.otpService.getTempUser(email);
        if (!user) return res.status(400).json({ message: "Session expired please signup again" });

        await sendSignupOtp(user.email, this.otpService, this.emailService);
        return res.status(200).json({ message: 'OTP Sent Successfully' });
    };

    public getCurrentUser = async (req: Request, res: Response): Promise<any> => {
        try {
            const userId = req.query.id;
            console.log(userId)
            if (!userId || typeof userId !== 'string') {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const user = await this.userRepo.getUserById(userId);
            if (!user) return res.status(404).json({ error: 'User not found' });

            const userData = {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            };

            res.status(HTTP_STATUS.OK.code).json({ data: userData });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    };

}
