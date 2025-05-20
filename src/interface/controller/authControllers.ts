import { Request, Response, NextFunction } from "express";
import IAuthController from "../../domain/interfaces/IAuthController";
import { register } from "../../application/usecase/user/registerUserUseCase";
import { login } from "../../application/usecase/user/loginUser";
import { UserRepository } from "../../infrastructure/database/repositories/UserRepository";
import { env } from "../../config/authConfig";
import { HttpStatusCode } from "../../application/constants/httpStatus";
import { verifyOtp } from "../../application/usecase/auth/verifyOtp";
import { resendOtp } from "../../application/usecase/auth/resendOtp";
import { AuthService } from "../../infrastructure/service/AuthService";
import { User } from "../../domain/entities/User";
import { loginUserUseCase } from "../../application/usecase/auth/loginUserUseCase";



export default class AuthController implements IAuthController {
   constructor( 
    private userRepo = new UserRepository,
    private authService = new AuthService,
    private loginOrRegisterUseCase = new loginUserUseCase
   ) {}

    public signup = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        const { name, email, password, confirmPassword, role } = req.body;
        const result = await register({ name, email, password, confirmPassword, role });
        res.status(result.status).json(result.data);    
    };// OK 

    public async login (req: Request, res: Response): Promise<any> {
        const { email, password } = req.body;
        const result = await login({ email, password, role: ['user'] });

        if(result.status !== HttpStatusCode.OK) {
            return res.status(result.status).json(result.data);
        }

        //setting the access token in cookie
        res.cookie('accessToken', result.token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: env.NODE_ENV == 'production',
            maxAge: env.ACCESS_TOKEN_EXPIRE
        });
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: env.REFRESH_TOKEN_EXPIRE,
        });
        const { token, refreshToken, data } = result;
        res.status(HttpStatusCode.OK).json(data.user)
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

        res.status(HttpStatusCode.OK).json({ message: "Logged out successfully" });
    };

    public adminLogin = async (req: Request, res: Response): Promise<any> => {
        const { email, password } = req.body;
        const result = await login({ email, password, role: ['admin'] });

        if(result.status !== HttpStatusCode.OK){
            return res.status(result.status).json(result.data);
        }

        res.clearCookie('adminRefreshToken', { path: '/admin' });

        res.cookie('adminAccessToken', result.token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: env.NODE_ENV === 'production',
            maxAge: env.ACCESS_TOKEN_EXPIRE,
            path: '/',
        });

        res.cookie('adminRefreshToken', result.refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: env.NODE_ENV === 'production',
            maxAge: env.REFRESH_TOKEN_EXPIRE,
            path: '/',
        });

        const { token, refreshToken, data } = result;

        res.status(HttpStatusCode.OK).json(data.user);
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

        res.status(HttpStatusCode.OK).json({ message: "Admin logged out successfully" });
    };

    public async guideLogin (req: Request, res: Response): Promise<any> {
       const { email, password } = req.body;
       const result = await login({ email, password, role: ['guide'] });

       if(result.status !== HttpStatusCode.OK){
        return res.status(result.status).json(result.data);
       };

       const { token, refreshToken, data } = result

       res.cookie('guideAccessToken', token, {
            httpOnly: true,
            secure: env.NODE_ENV == 'production',
            sameSite: 'strict',
            maxAge: env.ACCESS_TOKEN_EXPIRE,
       });

       res.cookie('guideRefreshToken', refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: env.REFRESH_TOKEN_EXPIRE,
       });

       return res.status(result.status).json(data.user);
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

        res.status(HttpStatusCode.OK).json({ message: 'guide Logged Out successfully' });

    }

    public refreshAccessToken = async (req: Request, res: Response): Promise<any> => {
        const token = req.cookies?.refreshToken;
        if (!token) return res.status(HttpStatusCode.UNAUTHORIZED).json({ error: 'Refresh Token is missing' });

        try {

            const payload = this.authService.verifyRefreshToken(token);
            const user = await this.userRepo.getUserById(payload.id);

            if(!user) {
                return res.status(HttpStatusCode.NOT_FOUND).json({ error: 'User not found' });
            }

            const newAccessToken = this.authService.generateAccessToken({id: user?._id, role: user?.role});

            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: env.ACCESS_TOKEN_EXPIRE,
            });

            res.status(HttpStatusCode.OK).json({ success: true });
        } catch (error) {
            console.error('Refresh Error: ', error);
            res.status(HttpStatusCode.FORBIDDEN).json({ error: "Invalid refresh token" });
        }
    };

    public verifyOtp = async (req: Request, res: Response): Promise<any> => {
        try {
            const { email, otp } = req.body;
            const result = await verifyOtp({email, otp});
            if(result.status !== HttpStatusCode.CREATED){
                return res.status(result.status).json(result.data);
            }
            return res.status(result.status).json(result.data);
        } catch (error: any) {
            console.log("Error in verify OTP", error.message);
        }
    };

    public resendOtp = async (req: Request, res: Response): Promise<any> => {
        try {
            const { email } = req.body;

            const result = await resendOtp(email);
            if(result.status !== HttpStatusCode.OK){
                return res.status(result.status).json(result.data);
            };
            return res.status(result.status).json(result.data)
        } catch (error: any) {
            console.log('Error for resend OTP', error.message)
        }
    };

    public getCurrentUser = async (req: Request, res: Response): Promise<any> => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ error: 'UnAuthorized' });

            const user = await this.userRepo.getUserById(userId);
            if (!user) return res.status(HttpStatusCode.NOT_FOUND).json({ error: 'User not found' });

            const userData = {
                id: user?._id,
                name: user?.name,
                email: user?.email,
                role: user?.role
            };

            res.status(HttpStatusCode.OK).json(userData);
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }

    }

    public googleLoginVerify = async ( req: Request, res: Response ): Promise<any> => {
        try {
            const { email, name } = req.body;
            const user = await this.loginOrRegisterUseCase.execute(email, name);
            if(user.blocked){
                return res.status(HttpStatusCode.UNAUTHORIZED).json({
                    message: "Your account is Blocked"
                })
            }

            const accessToken = this.authService.generateAccessToken({ id: user._id, role: user.role })
            const refreshToken = this.authService.generateRefreshToken({ id: user._id, role: user.role });

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                sameSite: 'strict',
                secure: env.NODE_ENV === 'production',
                maxAge: env.ACCESS_TOKEN_EXPIRE,
            })

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'strict',
                secure: env.NODE_ENV == 'production',
                maxAge: env.REFRESH_TOKEN_EXPIRE,
            });

            return res.status(HttpStatusCode.OK).json({
                message: "login Successfull",
                data:{
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });

        } catch (error: any) {
            if(error.message == 'User not exists') {
                return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'User not exists' });
            }
            console.error("Google Login Error", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                message: 'Google Login Failed'
            })
        }
    }

    
}
