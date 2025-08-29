import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { HttpStatusCode } from "../../constants/httpStatus";
import { ForgotPasswordDTO } from "../../dto/auth/ForgotPasswordDTO";
import { IForgotPasswordService } from "../../interfaces/services/IForgotPasswordService";
import { IForgotPasswordUseCase } from "./interface/IForgotPasswordUseCase";



export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
    constructor(
        private readonly _userRepo : IUserRepository,
        private readonly _forgotPasswordService : IForgotPasswordService

    ) {};
    async execute(email: string): Promise<ForgotPasswordDTO> {
        if(!email) throw new Error("Email is requied");
        
        const userData = await this._userRepo.findByEmail(email);
        if(!userData){
            return {
                status: HttpStatusCode.NOT_FOUND,
                data: { message: "User not found" }
            }
        }

        await this._forgotPasswordService.sendForgotPasswordOtp(email);
        return {
            status: HttpStatusCode.OK,
            data: { message: "OTP sent successfully" }
        };
    }
}