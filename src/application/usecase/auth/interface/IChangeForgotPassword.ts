import { ForgotPasswordDTO } from "../../../dto/auth/ForgotPasswordDTO";




export interface IChangeForgotPassword {
    execute(email: string, newPassword: string): Promise<ForgotPasswordDTO>
}