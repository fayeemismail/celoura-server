import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { HttpStatusCode } from "../../constants/httpStatus";
import { ForgotPasswordDTO } from "../../dto/auth/ForgotPasswordDTO";
import { IPasswordService } from "../../interfaces/services/IPasswordService";
import { IChangeForgotPassword } from "./interface/IChangeForgotPassword";




export class ChangeForgotPasswordUseCase implements IChangeForgotPassword {
    constructor(
        private readonly _userRepo : IUserRepository,
        private readonly _passwordService : IPasswordService
    ) {};
    async execute(email: string, newPassword: string): Promise<ForgotPasswordDTO> {
        if(!email || !newPassword){
            return {
                status: HttpStatusCode.NOT_FOUND,
                data: { message: "Email and new password is required" }
            }
        };

        const user = await this._userRepo.findByEmail(email);
        if(!user) {
            return {
                status: HttpStatusCode.NOT_FOUND,
                data: { message : "User not found" }
            }
        };

        const isCurrentPasswordDuplicate = await this._passwordService.comparePassword(newPassword, user.password);
        if(isCurrentPasswordDuplicate){
            return {
                status: HttpStatusCode.BAD_REQUEST,
                data: { message: "Try to add different password" }
            }
        };

        const hashedPassword = await this._passwordService.hashPassword(newPassword);
        await this._userRepo.changePasswordByEmail(email, hashedPassword);

        return {
            status: HttpStatusCode.OK,
            data: { message: "Password Changed Successfully" }
        }
    }
} 