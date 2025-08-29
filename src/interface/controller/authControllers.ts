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
import { IVerifyForgotPasswordUseCase } from "../../application/usecase/auth/interface/IVerifyPasswordForgotUseCase";
import { IChangeForgotPassword } from "../../application/usecase/auth/interface/IChangeForgotPassword";
import AppError from "../../utils/AppError";

export default class AuthController implements IAuthController {
  constructor(
    private _loginOrRegisterGoogleUseCase: IRegisterGoogleUseCase,
    private _loginGuideGoogleUseCase: ILoginGuideGoogleUseCase,
    private _registerUseCase: IRegisterUserUseCase,
    private _loginUserUseCase: ILoginUserUseCase,
    private readonly _refreshAccessTokenUseCase: IRefreshAccessTokenUseCase,
    private readonly _getUserUseCase: IGetUserProfile,
    private readonly _resendOtpUseCase: IResendOtpUseCase,
    private readonly _verifyOtpUseCase: IVerifyOtpUseCase,
    private readonly _forgotPasswordUseCase: IForgotPasswordUseCase,
    private readonly _verifyForgotPasswordOtpUseCse: IVerifyForgotPasswordUseCase,
    private readonly _resentForgotPassOtpUseCase: IResentForgotPasswordUseCase,
    private readonly _changeForgotPasswordUseCase: IChangeForgotPassword
  ) {}

  public signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, confirmPassword, role } = req.body;
      const result = await this._registerUseCase.execute({
        name,
        email,
        password,
        confirmPassword,
        role,
      });
      res.status(result.status).json(result.data);
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await this._loginUserUseCase.execute({
        email,
        password,
        role: ["user"],
      });

      if (
        result.status !== HttpStatusCode.OK ||
        !result.data?.user ||
        !result.token ||
        !result.refreshToken
      ) {
        throw new AppError(
          result.data?.error || "Invalid credentials",
          result.status
        );
      }

      res.cookie("accessToken", result.token, {
        httpOnly: true,
        sameSite: "strict",
        secure: env.NODE_ENV == "production",
        maxAge: env.ACCESS_TOKEN_EXPIRE,
      });
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: env.REFRESH_TOKEN_EXPIRE,
      });

      res.status(HttpStatusCode.OK).json(result.data.user);
    } catch (error) {
      next(error);
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
    res
      .status(HttpStatusCode.OK)
      .json({ message: "Logged out successfully" });
  };

  public adminLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await this._loginUserUseCase.execute({
        email,
        password,
        role: ["admin"],
      });

      if (
        result.status !== HttpStatusCode.OK ||
        !result.data?.user ||
        !result.token ||
        !result.refreshToken
      ) {
        throw new AppError(
          result.data?.error || "Invalid admin credentials",
          result.status
        );
      }

      res.clearCookie("adminRefreshToken", { path: "/admin" });

      res.cookie("adminAccessToken", result.token, {
        httpOnly: true,
        sameSite: "strict",
        secure: env.NODE_ENV === "production",
        maxAge: env.ACCESS_TOKEN_EXPIRE,
        path: "/",
      });

      res.cookie("adminRefreshToken", result.refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: env.NODE_ENV === "production",
        maxAge: env.REFRESH_TOKEN_EXPIRE,
        path: "/",
      });

      res.status(HttpStatusCode.OK).json(result.data.user);
    } catch (error) {
      next(error);
    }
  };

  public adminLogout = (req: Request, res: Response): void => {
    res.clearCookie("adminAccessToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: env.NODE_ENV === "production",
    });
    res.clearCookie("adminRefreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: env.NODE_ENV === "production",
    });
    res
      .status(HttpStatusCode.OK)
      .json({ message: "Admin logged out successfully" });
  };

  public guideLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await this._loginUserUseCase.execute({
        email,
        password,
        role: ["guide"],
      });

      if (
        result.status !== HttpStatusCode.OK ||
        !result.data?.user ||
        !result.token ||
        !result.refreshToken
      ) {
        throw new AppError(
          result.data?.error || "Invalid guide credentials",
          result.status
        );
      }

      res.cookie("guideAccessToken", result.token, {
        httpOnly: true,
        secure: env.NODE_ENV == "production",
        sameSite: "strict",
        maxAge: env.ACCESS_TOKEN_EXPIRE,
      });

      res.cookie("guideRefreshToken", result.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: env.REFRESH_TOKEN_EXPIRE,
      });

      res.status(result.status).json(result.data.user);
    } catch (error) {
      next(error);
    }
  };

  public guideLogout = (req: Request, res: Response): void => {
    res.clearCookie("guideAccessToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: env.NODE_ENV === "production",
    });
    res.clearCookie("guideRefreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: env.NODE_ENV === "production",
    });
    res
      .status(HttpStatusCode.OK)
      .json({ message: "Guide logged out successfully" });
  };

  public refreshAccessToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = req.cookies?.refreshToken;
      if (!token) {
        throw new AppError("Refresh Token is missing", HttpStatusCode.UNAUTHORIZED);
      }

      const { accessToken } = await this._refreshAccessTokenUseCase.execute(token);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: env.ACCESS_TOKEN_EXPIRE,
      });

      res.status(HttpStatusCode.OK).json({ success: true });
    } catch (error) {
      next(error);
    }
  };

  public verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, otp } = req.body;
      const result = await this._verifyOtpUseCase.execute({ email, otp });
      res.status(result.status).json(result.data);
    } catch (error) {
      next(error);
    }
  };

  public resendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const result = await this._resendOtpUseCase.execute(email);
      res.status(result.status).json(result.data);
    } catch (error) {
      next(error);
    }
  };

  public getCurrentUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = (req as any).user?._id;
      if (!userId)
        throw new AppError("Unauthorized", HttpStatusCode.UNAUTHORIZED);

      const user = await this._getUserUseCase.execute(userId);
      if (!user) throw new AppError("User not found", HttpStatusCode.NOT_FOUND);

      const userData = UserProfileDTO.formDomain(user);
      res.status(HttpStatusCode.OK).json(userData);
    } catch (error) {
      next(error);
    }
  };

  public googleLoginVerify = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, name } = req.body;
      const { user, accessToken, refreshToken } =
        await this._loginOrRegisterGoogleUseCase.execute(email, name);

      if (user.blocked) {
        throw new AppError("Your account is Blocked", HttpStatusCode.UNAUTHORIZED);
      }

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: env.NODE_ENV === "production",
        maxAge: env.ACCESS_TOKEN_EXPIRE,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: env.NODE_ENV == "production",
        maxAge: env.REFRESH_TOKEN_EXPIRE,
      });

      const userData = UserProfileDTO.formDomain(user);
      res.status(HttpStatusCode.OK).json({
        message: "Login successful",
        data: userData,
      });
    } catch (error) {
      next(error);
    }
  };

  public googleVerifyGuide = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, name } = req.body;
      const { guide, accessToken, refreshToken } =
        await this._loginGuideGoogleUseCase.execute(email, name);

      if (guide.blocked) {
        throw new AppError("Your Account is Blocked", HttpStatusCode.UNAUTHORIZED);
      }

      res.cookie("guideAccessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: env.NODE_ENV == "production",
        maxAge: env.ACCESS_TOKEN_EXPIRE,
      });
      res.cookie("guideRefreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: env.NODE_ENV == "production",
        maxAge: env.REFRESH_TOKEN_EXPIRE,
      });

      const guideData = GuideDataDto.formDomain(guide);
      res.status(HttpStatusCode.OK).json({
        message: "Login successful",
        data: guideData,
      });
    } catch (error) {
      next(error);
    }
  };

  public requestPasswordReset = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;
      const response = await this._forgotPasswordUseCase.execute(email);
      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  public verifyForgotPassOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, otp } = req.body;
      const response = await this._verifyForgotPasswordOtpUseCse.execute(email, otp);
      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  public resentForgotPasswordOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;
      const response = await this._resentForgotPassOtpUseCase.execute(email);
      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  public changeForgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, newPassword } = req.body;
      const response = await this._changeForgotPasswordUseCase.execute(
        email,
        newPassword
      );
      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };
}
