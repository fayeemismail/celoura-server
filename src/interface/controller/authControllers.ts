import { Request, Response, NextFunction } from "express";
import { env } from "../../config/authConfig";
import { HttpStatusCode } from "../../application/constants/httpStatus";
import IAuthController from "../../domain/interfaces/IAuthController";
import { ILoginGuideGoogleUseCase } from "../../application/usecase/auth/interface/ILoginGuideGoogleUseCase";
import { IRegisterUserUseCase } from "../../application/usecase/user/interface/IRegisterUserUseCase";
import { ILoginUserUseCase } from "../../application/usecase/user/interface/ILoginUserUseCase";
import { IRegisterGoogleUseCase } from "../../application/usecase/auth/interface/IRegisterGoogleUseCase";
import { IRefreshAccessTokenUseCase } from "../../application/usecase/auth/interface/IRefreshAccessTokenUseCase";
import { IGetUserProfile } from "../../application/usecase/user/interface/IGetUserProfileUseCase";
import { UserProfileDTO } from "../../application/dto/user/UserProfileDto";
import { GuideDataDto } from "../../application/dto/guide/guideDataDto";
import { extractErrorMessage } from "../../utils/errorHelpers";
import { IResendOtpUseCase } from "../../application/interfaces/services/IResendOtpService";
import { IVerifyOtpUseCase } from "../../application/usecase/auth/interface/IVerifyOtpUseCase";
import { IForgotPasswordUseCase } from "../../application/usecase/auth/interface/IForgotPasswordUseCase";
import { IResentForgotPasswordUseCase } from "../../application/usecase/auth/interface/IResentForgotPasswordOtpUseCase";
import { IVerifyForgotPasswordUseCase } from "../../application/usecase/auth/interface/IverifyForgotPasswordOtpUseCase";



export default class AuthController implements IAuthController {
    constructor(
        private _loginOrRegisterGoogleUseCase: IRegisterGoogleUseCase,
        private _loginGuideGoogleUseCase: ILoginGuideGoogleUseCase,
        private _registerUseCase: IRegisterUserUseCase,
        private _loginUserUseCase: ILoginUserUseCase,
        private readonly _refreshAccessTokenUseCase: IRefreshAccessTokenUseCase,
        private readonly _getUserUseCase : IGetUserProfile,
        private readonly _resendOtpUseCase : IResendOtpUseCase,
        private readonly _verifyOtpUseCase : IVerifyOtpUseCase,
        private readonly _forgotPasswordUseCase : IForgotPasswordUseCase,
        private readonly _verifyForgotPasswordOtpUseCse : IVerifyForgotPasswordUseCase,
        private readonly _resentForgotPassOtpUseCase : IResentForgotPasswordUseCase
    ) { }

    public signup = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, password, confirmPassword, role } = req.body;
            const result = await this._registerUseCase.execute({ name, email, password, confirmPassword, role });
            res.status(result.status).json(result.data);
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: error || "Some thing went wrong" });
        }
    };

    public login = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const result = await this._loginUserUseCase.execute({ email, password, role: ['user'] });
        if (result.status !== HttpStatusCode.OK || !result.data?.user || !result.token || !result.refreshToken) {
            res.status(result.status).json({
                success: false,
                message: result.data?.error
            });
            return;
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
        res.status(HttpStatusCode.OK).json(data.user);
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

    public adminLogin = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const result = await this._loginUserUseCase.execute({ email, password, role: ['admin'] });

        if (result.status !== HttpStatusCode.OK || !result.data?.user || !result.token || !result.refreshToken) {
            res.status(result.status).json({
                success: false,
                message: result.data?.error
            });
            return;
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

    public guideLogin = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const result = await this._loginUserUseCase.execute({ email, password, role: ['guide'] });

        if (result.status !== HttpStatusCode.OK || !result.data?.user || !result.token || !result.refreshToken) {
            res.status(result.status).json({
                success: false,
                message: result.data?.error
            });
            return;
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

        res.status(result.status).json(data.user);
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

    public refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
        const token = req.cookies?.refreshToken;
        if (!token) {
            res.status(HttpStatusCode.UNAUTHORIZED).json({ error: 'Refresh Token is missing' });
            return;
        }
        try {
            const { accessToken } = await this._refreshAccessTokenUseCase.execute(token);

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: env.ACCESS_TOKEN_EXPIRE,
            });

            res.status(HttpStatusCode.OK).json({ success: true });
        } catch (error: unknown) {
            console.error('Refresh Error: ', error);
            if (error instanceof Error) {
                if (error.message === 'User not found') {
                    res.status(HttpStatusCode.NOT_FOUND).json({ error: 'User not found' });
                } else {
                    res.status(HttpStatusCode.FORBIDDEN).json({ error: 'Invalid refresh token' });
                }
            } else {
                res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Unexpected error' });
            }
        }
    };

    public verifyOtp = async (req: Request, res: Response) => {
        try {
            const { email, otp } = req.body;
            const result = await this._verifyOtpUseCase.execute({ email, otp });
            if (result.status !== HttpStatusCode.CREATED) {
                res.status(result.status).json(result.data);
                return;
            }
            res.status(result.status).json(result.data);
        } catch (error: unknown) {
            console.log("Error in verify OTP", error);
        }
    };

    public resendOtp = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            const result = await this._resendOtpUseCase.execute(email);
            if (result.status !== HttpStatusCode.OK) {
                res.status(result.status).json(result.data);
                return;
            };
            res.status(result.status).json(result.data)
        } catch (error: unknown) {
            const message = extractErrorMessage(error);
            console.log('Error for resend OTP', message);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: message || "Something went wrong on reSend otp" });
        }
    };

    public getCurrentUser = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user?._id;
            if (!userId)res.status(HttpStatusCode.UNAUTHORIZED).json({ error: 'UnAuthorized' });

            const user = await this._getUserUseCase.execute(userId);
            if (!user)res.status(HttpStatusCode.NOT_FOUND).json({ error: 'User not found' });

            const userData = UserProfileDTO.formDomain(user)

            res.status(HttpStatusCode.OK).json(userData);
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }

    }

    public googleLoginVerify = async (req: Request, res: Response) => {
        try {
            const { email, name } = req.body;
            const { user, accessToken, refreshToken } = await this._loginOrRegisterGoogleUseCase.execute(email, name);
            if (user.blocked) {
                res.status(HttpStatusCode.UNAUTHORIZED).json({
                    message: "Your account is Blocked"
                });
                return;
            };

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

            const userData = UserProfileDTO.formDomain(user)

            res.status(HttpStatusCode.OK).json({
                message: "login Successfull",
                data: userData,
            });

        } catch (error: unknown) {
            console.error('Google Login Error: ', error);
            if(error instanceof Error && error.message === 'Access denied'){
                res.status(HttpStatusCode.FORBIDDEN).json({ message: error.message })
            } else {
                res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Google Login failed"  })
            }
            
        }
    }

    public googleVerifyGuide = async (req: Request, res: Response) => {
        try {
            const { email, name } = req.body;
            const {guide, accessToken, refreshToken} = await this._loginGuideGoogleUseCase.execute(email, name);
            if (guide.blocked) {
                res.status(HttpStatusCode.UNAUTHORIZED).json({
                    message: "Your Account is Blocked"
                });
                return 
            };

            res.cookie('guideAccessToken', accessToken, {
                httpOnly: true,
                sameSite: 'strict',
                secure: env.NODE_ENV == 'production',
                maxAge: env.ACCESS_TOKEN_EXPIRE
            });

            res.cookie('guideRefreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'strict',
                secure: env.NODE_ENV == 'production',
                maxAge: env.REFRESH_TOKEN_EXPIRE
            });

            const guideData = GuideDataDto.formDomain(guide)

            res.status(HttpStatusCode.OK).json({
                message: 'login successfull',
                data: guideData,
            });

        } catch (error: any) {
            console.error('Google Login Error: ', error);
            if(error instanceof Error && error.message === 'Access denied'){
                res.status(HttpStatusCode.FORBIDDEN).json({ message: error.message })
            } else {
                res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Google Login failed"  })
            }
        }
    }

    public requestPasswordReset = async(req: Request, res: Response) => {
        const {email} = req.body
        try {
            const response = await this._forgotPasswordUseCase.execute(email);
            res.status(HttpStatusCode.OK).json(response);
        } catch (error) {
            const message = extractErrorMessage(error)
            console.log(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: message ?? "Cannot sent Otp" })
        }
    };

    public verifyForgotPassOtp = async(req: Request, res: Response) => {
        const {email, otp} = req.body
        try {
            // console.log(email, otp);
            const response = await this._verifyForgotPasswordOtpUseCse.execute(email, otp);
            res.status(HttpStatusCode.OK).json(response);
        } catch (error) {
            console.log(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Cannot verify Otp" })
        }
    };

    public resentForgotPasswordOtp = async(req: Request, res: Response) => {
        const {email} = req.body
        try {
            const response = await this._resentForgotPassOtpUseCase.execute(email);
            res.status(HttpStatusCode.OK).json(response);
        } catch (error) {
            const message = extractErrorMessage(error);
            console.log(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: message ?? "Cannot re-sent Otp" })
        }
    };

    public changeForgotPassword = async(req: Request, res: Response) => {
        const {email, newPassword} = req.body;
        try {
            console.log(email, newPassword);
            // const response = await this._resentForgotPassOtpUseCase.execute(email);
            // res.status(HttpStatusCode.OK).json(response);
        } catch (error) {
            const message = extractErrorMessage(error);
            console.log(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: message ?? "Cannot re-sent Otp" })
        }
    };
}
