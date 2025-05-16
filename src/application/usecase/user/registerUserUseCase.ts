import { UserRepository } from "../../../infrastructure/database/repositories/UserRepository";
import { AuthService } from "../../../infrastructure/service/AuthService";
import { EmailService } from "../../../infrastructure/service/EmailService";
import { OtpRepository } from "../../../infrastructure/database/repositories/OtpService";
import { HttpStatusCode } from "../../constants/httpStatus";
import { sendSignupOtp } from "./sendSignupOtp";





const userRepo = new UserRepository();
const otpRepo = new OtpRepository();
const emailService = new EmailService();
const authService = new AuthService();


interface RegisterInput {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
};

export const register = async ({ name, email, password, confirmPassword, role  }: RegisterInput) => {
    try {
        const existingUser = await userRepo.findByEmail(email);
        if(existingUser) {
            return { status: HttpStatusCode.BAD_REQUEST, data: { error: 'User already exists' } };
        };

        if(password !== confirmPassword){
            return { status: HttpStatusCode.BAD_REQUEST, data: { error: 'Password do not match' } };
        };

        await otpRepo.setTempUser(email, { name, email, confirmPassword, role });
        await sendSignupOtp(email, otpRepo, emailService);

        return {status: HttpStatusCode.OK, data: { message: 'OTP sent to email' } };
    } catch (error: any) {
        return { status: HttpStatusCode.INTERNAL_SERVER_ERROR, data: { error: error.message } };
    };
}