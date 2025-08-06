import { HttpStatusCode } from "../../constants/httpStatus";
import { sendSignupOtp } from "../user/sendSignupOtp";
import { IResendOtpUseCase } from "../../interfaces/services/IResendOtpService";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository";
import { IEmailService } from "../../interfaces/services/IEmailService";

export class ResendOtpUseCase implements IResendOtpUseCase {
  constructor(
    private readonly otpRepo: IOtpRepository,
    private readonly emailService: IEmailService
  ) {}

  async execute(email: string): Promise<{status: number; data: { message?: string; error?: string }}> {
    
    const existingOtp = await this.otpRepo.getOtp(email);
    if (existingOtp) {
      await this.otpRepo.deleteOtp(email);
    }

    const tempUser = await this.otpRepo.getTempUser(email);
    if (!tempUser) {
      return {
        status: HttpStatusCode.BAD_REQUEST,
        data: { error: "Session expired. Please sign up again." },
      };
    }

    await sendSignupOtp(tempUser.email, this.otpRepo, this.emailService);

    return {
      status: HttpStatusCode.OK,
      data: { message: "OTP sent successfully" },
    };
  }
}
