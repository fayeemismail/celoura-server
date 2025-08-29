import crypto from "crypto";
import { IForgotPasswordService } from "../../application/interfaces/services/IForgotPasswordService";
import { IOtpRepository } from "../../domain/interfaces/IOtpRepository";
import { IEmailService } from "../../application/interfaces/services/IEmailService";

export class ForgotPasswordService implements IForgotPasswordService {
  private redisService: IOtpRepository;
  private mailService: IEmailService;

  constructor(redisService: IOtpRepository, mailService: IEmailService) {
    this.redisService = redisService;
    this.mailService = mailService;
  }

  async sendForgotPasswordOtp(email: string): Promise<string> {
    
    const otp = crypto.randomInt(100000, 999999).toString();


    await this.redisService.setOtp(`forgot:${email}`, otp);

 
    await this.mailService.sentForgotPasswordOtpEmail(email, otp);

    console.log("Forgot password OTP for ", email, " is: ", otp);

    return otp;
  }
}
