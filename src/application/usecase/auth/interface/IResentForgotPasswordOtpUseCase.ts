import { ForgotPasswordDTO } from "../../../dto/auth/ForgotPasswordDTO";



export interface IResentForgotPasswordUseCase {
    execute(email: string): Promise<ForgotPasswordDTO>
}