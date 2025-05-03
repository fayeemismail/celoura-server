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


const userRepo = new UserRepository();
const authService = new AuthService();
const otpService = new OtpService();
const emailService = new EmailService();



export const signup = async ( req: Request, res: Response, next: NextFunction ): Promise<any> => {
    try {
        // console.log(req.body)
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
        res.status(400).json({ error: error.message })
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
    console.log(userData)
    if(!userData){
        return res.status(400).json({ message: "Session expired please signup again" })
    } 
    const user = await registerUser(userData.name, userData.email, userData.confirmPassword, userData.role, userRepo, authService);

    await otpService.deleteOtp(email);
    await otpService.deleteTempUser(email);

    res.status(201).json({ user, message: "User registered successfully" });

};

export const resendOtp = async ( req: Request, res: Response ): Promise<any> => {
    const {email} =  req.body;

    const otp = await otpService.getOtp(email)
    if(otp){
        await otpService.deleteOtp(email)
        console.log('old otp deleted');
    }
    const user = await otpService.getTempUser(email);
    if(!user) return res.status(400).json({ message: "Session expired please signup again" });

    await sendSignupOtp(user.email, otpService, emailService)
    return res.status(200).json({message: 'OTP Sent Successfully'})
};


// const refreshAccessToken = async (req: Request, res: Response) => {
//     const token = req.cookies?.accessToken

//     if(!token) {
//         return res.status(401).json({ message: "No refresh token" });
//     }

//     try {
//         const payload = jwt.verify(token, env.JWT_REFRESH_SECRET!) as JwtPayload;
//         const newAccessToken = jwt.sign({ userId: payload.userId }, env.JWT_ACCESS_SECRET!, { expiresIn: '15m' });

//         res.cookie('accessToken', newAccessToken, {
//             httpOnly: true,
//             secure: true,
//             sameSite: 'strict',
//             maxAge: env.ACCESS_TOKEN_EXPIRE,
//         });
//         res.status(200).json({ success: true});
//     } catch (error) {
//         res.clearCookie('accessToken');
//         res.clearCookie('refreshAccessToken');
//         return res.status(403).json({ message: 'Invalid or expire refrresh toke' })
//     }
// }