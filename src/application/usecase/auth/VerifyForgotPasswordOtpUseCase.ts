import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository";
import { HttpStatusCode } from "../../constants/httpStatus";
import { ForgotPasswordDTO } from "../../dto/auth/ForgotPasswordDTO";
import { IVerifyForgotPasswordUseCase } from "./interface/IVerifyPasswordForgotUseCase";




export class VerifyForgotPasswordOtpUseCse implements IVerifyForgotPasswordUseCase {
    constructor(
        private readonly _otpRepo: IOtpRepository
    ) {};
    async execute(email: string, otp: string): Promise<ForgotPasswordDTO> {
        if(!email || !otp) throw new Error("Email or Otp is missing");
        
        const savedOtp = await this._otpRepo.getOtp(`forgot:${email}`);
        console.log('saved otp', savedOtp)
        if(!savedOtp) {
            return {
                status: HttpStatusCode.NOT_FOUND,
                data: { message: "Otp expired or invalid" }
            }
        };

        if(savedOtp !== otp) {
            return {
                status: HttpStatusCode.UNAUTHORIZED,
                data: { message: "Otp incorrect" }
            }
        };

        return {
            status: HttpStatusCode.OK,
            data : { message: "Otp Verification Success" }
        }
    }
}