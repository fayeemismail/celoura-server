import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { HttpStatusCode } from "../../constants/httpStatus";
import { ForgotPasswordDTO } from "../../dto/auth/ForgotPasswordDTO";
import { IForgotPasswordService } from "../../interfaces/services/IForgotPasswordService";
import { IResentForgotPasswordUseCase } from "./interface/IResentForgotPasswordOtpUseCase";




export class ResentForgotPasswordUsecase implements IResentForgotPasswordUseCase {
    constructor(
        private readonly _userRepo: IUserRepository,
        private readonly _forgotPasswordService : IForgotPasswordService,
        private readonly _otpRepo : IOtpRepository
    ) {};
    async execute(email: string): Promise<ForgotPasswordDTO> {
        if(!email) {
            return {
                status: HttpStatusCode.NOT_FOUND,
                data: { message: "Email not found" }
            }
        };

        const existingOtp = await this._otpRepo.getOtp(`forgot:${email}`);
        console.log(existingOtp, 'this is existingOtp');
        if(existingOtp){
            await this._otpRepo.deleteOtp(`forgot:${email}`);
        };

        const userData = await this._userRepo.findByEmail(email);
        if(!userData) {
            return {
                status: HttpStatusCode.NOT_FOUND,
                data: { message: "User not found" }
            }
        };

        await this._forgotPasswordService.sendForgotPasswordOtp(email);

        return {
            status: HttpStatusCode.OK,
            data: { message: "Otp sent it in your mail" }
        };
    }
}