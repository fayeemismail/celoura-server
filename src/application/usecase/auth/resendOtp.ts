import { HttpStatusCode } from "../../constants/httpStatus";
import { sendSignupOtp } from "../user/sendSignupOtp";
import { IResendOtpUseCase } from "../../interfaces/services/IResendOtpService";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository";
import { IEmailService } from "../../interfaces/services/IEmailService";

export class ResendOtpUseCase implements IResendOtpUseCase {
  constructor(
    private readonly _otpRepo: IOtpRepository,
    private readonly _emailService: IEmailService
  ) {}

  async execute(email: string): Promise<{status: number; data: { message?: string; error?: string }}> {
    
    const existingOtp = await this._otpRepo.getOtp(`otp:${email}`);
    if (existingOtp) {
      await this._otpRepo.deleteOtp(`otp:${email}`);
    }

    const tempUser = await this._otpRepo.getTempUser(email);
    if (!tempUser) {
      return {
        status: HttpStatusCode.BAD_REQUEST,
        data: { error: "Session expired. Please sign up again." },
      };
    }

    await sendSignupOtp(tempUser.email, this._otpRepo, this._emailService);

    return {
      status: HttpStatusCode.OK,
      data: { message: "OTP sent successfully" },
    };
  }
}
