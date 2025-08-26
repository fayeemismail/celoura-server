import { HttpStatusCode } from "../../constants/httpStatus";
import { ForgotPasswordDTO } from "../../dto/auth/ForgotPasswordDTO";
import { IChangeForgotPassword } from "./interface/IChangeForgotPassword";




export class ChangeForgotPasswordUseCase implements IChangeForgotPassword {
    constructor() {};
    async execute(email: string, newPassword: string): Promise<ForgotPasswordDTO> {
        


        return {
            status: HttpStatusCode.OK,
            data: { message: "Password Changed Successfully" }
        }
    }
} 