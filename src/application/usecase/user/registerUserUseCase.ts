import { EmailService } from "../../../infrastructure/service/EmailService";
import { HttpStatusCode } from "../../constants/httpStatus";
import { IRegisterUserUseCase, UseCaseErrorResponse, UseCaseSuccessResponse } from "./interface/IRegisterUserUseCase";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository";
import { sendSignupOtp } from "./sendSignupOtp";


interface RegisterInput {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
};


export class RegisterUseCase implements IRegisterUserUseCase{
    constructor(
        private readonly userRepo : IUserRepository,
        private readonly otpRepo : IOtpRepository,
        private readonly emailService: EmailService
    ){}
    async execute(input: RegisterInput): Promise<UseCaseErrorResponse | UseCaseSuccessResponse<{ message: string; }>> {
        const { name, email, password, confirmPassword, role } = input;
        const existingUser = await this.userRepo.findByEmail(email);
        if(existingUser){
            return { status: HttpStatusCode.BAD_REQUEST, data: { error: "User already exists" } };
        };

        if(password !== confirmPassword){
            return { status: HttpStatusCode.BAD_REQUEST, data: { error: "Password do not match" } };
        };

        await this.otpRepo.setTempUser(email, { name, email, password, role });
        await sendSignupOtp(email, this.otpRepo, this.emailService);
        
        return { status: HttpStatusCode.OK, data: { message: "OTP sent to email" } };
    }
};