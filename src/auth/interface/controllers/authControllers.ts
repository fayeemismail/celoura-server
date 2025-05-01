import { NextFunction, Request, Response } from "express";
import { AuthService } from "../../infrastructure/service/AuthService";
import { OtpService } from "../../infrastructure/service/OtpService";
import { EmailService } from "../../infrastructure/service/EmailService";
import { registerUser } from "../../usecase/user/registerUser";
import { sendSignupOtp } from "../../usecase/user/sendSignupOtp";
import { loginUser } from "../../usecase/user/loginUser";
import { UserRepository } from "../../infrastructure/service/UserRepository";


const userRepo = new UserRepository();
const authService = new AuthService();
const otpService = new OtpService();
const emailService = new EmailService();



export const signup = async ( req: Request, res: Response, next: NextFunction ): Promise<any> => {
    try {
        // console.log(req.body)
        const { name, email, password, confirmPassword, role, } = req.body;
        if(password !== confirmPassword){
            return res.status(400).json({ error: 'Invalid Credentials' });
        }


        
        await otpService.setTempUser(email, {name, email, confirmPassword, role} )
        

        await sendSignupOtp( email, otpService, emailService );

        res.status(200).json( { message: 'OTP sent to Email' } );
    } catch (error: any) {
        console.log(error.message);
        res.status(400).json({ error: error.message });
    }
};



// Login Controller
export const login = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;
        const { user, token, refreshToken } = await loginUser( email, password, userRepo, authService );

        
        //seting refresh Token
        res.cookie( 'refreshToken' , refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict",
            maxAge: 7 * 27 * 60 * 1000,  
        } );


        res.status(200).json({ user, token });
    } catch (error: any) {
        console.error('Login Error:', error);
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
}

