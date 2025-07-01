import { UserRepository } from "../../../infrastructure/database/repositories/UserRepository";
import { OtpRepository } from "../../../infrastructure/database/repositories/OtpService";
import { HttpStatusCode } from "../../constants/httpStatus";
import { PasswordService } from "../../../infrastructure/service/PasswordService";
import { extractErrorMessage } from "../../../utils/errorHelpers";


const otpRepo = new OtpRepository();
const userRepo = new UserRepository();
const passwordService = new PasswordService()

interface OtpInput {
    email: string;
    otp: string;
}

export const verifyOtp = async({ email, otp }: OtpInput) => {
    try {
        const savedOtp = await otpRepo.getOtp(email);
        if(!savedOtp) {
            return { status: HttpStatusCode.BAD_REQUEST, data: { error: 'OTP expired or Invalid' } };
        };

        if(savedOtp !== otp){
            return { status: HttpStatusCode.BAD_REQUEST, data: { error: 'Incorrect OTP' } };
        };

        const userData = await otpRepo.getTempUser(email);
        if(!userData) {
            return { status: HttpStatusCode.BAD_REQUEST, data:{ error: 'Session Expired please signUp again' } };
        };

        const  { name, email: userEmail, password, role,  } = userData;
        const hashed = await passwordService.hashPassword(password);

        const user = {
            name: name,
            email: userEmail,
            password: hashed,
            role: role,
            blocked: false,
            is_verified: false
        }

        await otpRepo.deleteOtp(email);
        await otpRepo.deleteTempUser(email);

        const savedUser = await userRepo.createUser(user);

        return { status: HttpStatusCode.CREATED, data: { savedUser, message: "User created successfully"  } }
    } catch (error: unknown) {
        const message = extractErrorMessage(error)
        console.error(message);
        return {
            status: HttpStatusCode.INTERNAL_SERVER_ERROR,
            data: {
                error: message || "Something went wrong"
            }
        };
    }
}