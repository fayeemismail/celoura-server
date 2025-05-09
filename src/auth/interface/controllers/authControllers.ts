import { NextFunction, Request, Response } from "express";
import { AuthService } from "../../infrastructure/service/AuthService";
import { OtpService } from "../../infrastructure/service/OtpService";
import { EmailService } from "../../infrastructure/service/EmailService";
import { registerUser } from "../../application/usecase/user/registerUser";
import { sendSignupOtp } from "../../application/usecase/user/sendSignupOtp";
import { loginUser } from "../../application/usecase/user/loginUser";
import { UserRepository } from "../../infrastructure/database/repositories/UserRepository";
import { env } from "../../config/authConfig";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { HTTP_STATUS } from "../../application/constants/httpStatus";


const userRepo = new UserRepository();
const authService = new AuthService();
const otpService = new OtpService();
const emailService = new EmailService();



//signup controller
export const signup = async ( req: Request, res: Response, next: NextFunction ): Promise<any> => {
    try {
        const { name, email, password, confirmPassword, role, } = req.body;
        const existingUser = await userRepo.findByEmail(email)
        if(existingUser) return res.status(400).json({ error: 'User already Exisits' })
        if(password !== confirmPassword){
            return res.status(400).json({ error: 'Invalid Credentials' });
        }

        await otpService.setTempUser(email, {name, email, confirmPassword, role} )
    
        await sendSignupOtp( email, otpService, emailService );

        res.status(200).json({ message: 'OTP sent to Email' });
    } catch (error: any) {
        console.log(error.message);
        res.status(400).json({ error: error.message });
    }
};



// Login Controller
export const login = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;
        const { user, token, refreshToken } = await loginUser( email, password, ['user'], userRepo, authService );

        

        res.cookie( 'accessToken', token, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: env.ACCESS_TOKEN_EXPIRE,
        } )

        //seting refresh Token
        res.cookie( 'refreshToken' , refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: "strict", 
            maxAge: env.REFRESH_TOKEN_EXPIRE,  
        } );


        res.status(200).json(user);
    } catch (error: any) {
        console.error('Login Error:', error);
        res.status(400).json({ error: error.message });
    }
};

export const adminLogin = async (req: Request, res: Response): Promise<any> => {
    try {
        const {email, password} = req.body;
        const { user, token, refreshToken } = await loginUser( email, password, ['admin'], userRepo, authService );


        res.cookie('accessToken', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: env.ACCESS_TOKEN_EXPIRE
        });
        

        res.cookie( 'refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: env.REFRESH_TOKEN_EXPIRE
        });

        res.status(200).json( user )
    } catch (error: any) {
        console.error("Login Error:", error);
        res.status(400).json({ error: error.message });
    }
};



export const verifyOtp = async ( req: Request, res: Response ): Promise<any> => {
    const { email, otp } = req.body;
    console.log(email, otp);

    const savedOtp = await otpService.getOtp(email);
    console.log(savedOtp, 'this is saved otp');

    if ( !savedOtp ) {
        return res.status(400).json({ message: "OTP expired or invalid" });
    };

    if (savedOtp !== otp ) {
        return res.status(400).json({ message: "Incorrect OTP" });
    };

    const userData = await otpService.getTempUser(email);
    if(!userData){
        return res.status(400).json({ message: "Session expired please signup again" });
    } 
    const user = await registerUser(userData.name, userData.email, userData.confirmPassword, userData.role, userRepo, authService);

    await otpService.deleteOtp(email);
    await otpService.deleteTempUser(email);

    res.status(201).json({ user, message: "User registered successfully" });

};

export const resendOtp = async ( req: Request, res: Response ): Promise<any> => {
    const {email} =  req.body;

    const otp = await otpService.getOtp(email);
    if(otp){
        await otpService.deleteOtp(email);
        console.log('old otp deleted');
    }
    const user = await otpService.getTempUser(email);
    if(!user) return res.status(400).json({ message: "Session expired please signup again" });

    await sendSignupOtp(user.email, otpService, emailService);
    return res.status(200).json({message: 'OTP Sent Successfully'});
};



export const refreshAccessToken = (req: Request, res: Response): any => {
    const token = req.cookies?.refreshToken;
    if(!token) return res.status(401).json({ error: 'Refresh Token is missing' });

    try {
        const payload = jwt.verify(token, env.JWT_REFRESH_SECRET!) as JwtPayload; 
        
        if(!payload || typeof payload == 'string' || !payload.id) {
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
}


export const getCurrentUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = (req as any).user?.id;
        if(!userId) return res.status(401).json({ error: 'unnAuthorized' });

        const user = await userRepo.getUserById(userId);
        console.log(user)
        if(!user) return res.status(404).json({ error: 'User not found' });
        const userData = {
            id: user?._id,
            name: user?.name,
            email: user?.email,
            role: user?.role
        };

        res.status(HTTP_STATUS.OK.code).json(userData);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}


export const logout = (req: Request, res: Response) => {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
  
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
  
    res.status(200).json({ message: "Logged out successfully" });
  };