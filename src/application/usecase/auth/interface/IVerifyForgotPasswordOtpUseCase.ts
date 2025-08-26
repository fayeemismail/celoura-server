import { ForgotPasswordDTO } from "../../../dto/auth/ForgotPasswordDTO";



export interface IVerifyForgotPasswordUseCase {
    execute(email: string, otp: string): Promise<ForgotPasswordDTO>;
}