import crypto from 'crypto';
import { IEmailService } from "../../domain/interfaces/IEmailService";
import { IOtpRepository } from "../../domain/interfaces/IOtpRepository";

export const sendSignupOtp = async (
    email: string,
    redisService: IOtpRepository,
    mailService: IEmailService
): Promise<string> => {

    // Generating OTP;
    const otp = crypto.randomInt(100000, 999999).toString();
    
    //sace otp to redis
    await redisService.setOtp(email, otp);
    
    //send otp via mail
    await mailService.sendOtpEmail(email, otp);

    console.log('otp to ', email, 'is: ', otp);
    
    return otp
}