import { EmailService } from "../../../infrastructure/service/EmailService";
import { OtpRepository } from "../../../infrastructure/database/repositories/OtpService"
import { HttpStatusCode } from "../../constants/httpStatus";
import { sendSignupOtp } from "../user/sendSignupOtp";


const otpRepo = new OtpRepository()
const emailService = new EmailService()

export const resendOtp = async(email: string) => {
    const otp = await otpRepo.getOtp(email);
    if(otp) {
        await otpRepo.deleteOtp(email)
    };

    const user = await otpRepo.getTempUser(email);
    if(!user) {
        return { status: HttpStatusCode.BAD_REQUEST, data: { error: 'Session expired Please sign up again' } };
    };

    await sendSignupOtp(user.email, otpRepo, emailService);
    return { status: HttpStatusCode.OK, data: { message: "OTP sent Successfully" } };
}