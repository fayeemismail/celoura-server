import { ForgotPasswordDTO } from "../../../dto/auth/ForgotPasswordDTO";



export interface IForgotPasswordUseCase {
    execute(email: string): Promise<ForgotPasswordDTO>
}