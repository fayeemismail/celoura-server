import { HttpStatusCode } from "../../constants/httpStatus";
import { extractErrorMessage } from "../../../utils/errorHelpers";
import { IVerifyOtpUseCase, OtpInput } from "./interface/IVerifyOtpUseCase";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IPasswordService } from "../../interfaces/services/IPasswordService";
import { User } from "../../../domain/entities/User";

export class VerifyOtpUseCase implements IVerifyOtpUseCase {
  constructor(
    private readonly otpRepo: IOtpRepository,
    private readonly userRepo: IUserRepository,
    private readonly passwordService: IPasswordService
  ) {}

  async execute({email, otp}: OtpInput): Promise<{ status: number; data: { message?: string; error?: string; savedUser?: User; }; }> {
      try {
      const savedOtp = await this.otpRepo.getOtp(email);
      if (!savedOtp) {
        return {
          status: HttpStatusCode.BAD_REQUEST,
          data: { error: "OTP expired or Invalid" },
        };
      }

      if (savedOtp !== otp) {
        return {
          status: HttpStatusCode.BAD_REQUEST,
          data: { error: "Incorrect OTP" },
        };
      }

      const userData = await this.otpRepo.getTempUser(email);
      if (!userData) {
        return {
          status: HttpStatusCode.BAD_REQUEST,
          data: { error: "Session Expired. Please sign up again." },
        };
      }

      const { name, email: userEmail, password, role } = userData;
      const hashedPassword = await this.passwordService.hashPassword(password);

      const user = {
        name,
        email: userEmail,
        password: hashedPassword,
        role,
        blocked: false,
        is_verified: false,
      };

      await this.otpRepo.deleteOtp(email);
      await this.otpRepo.deleteTempUser(email);

      const savedUser = await this.userRepo.createUser(user);

      return {
        status: HttpStatusCode.CREATED,
        data: {
          message: "User created successfully",
          savedUser,
        },
      };
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      console.error(message);
      return {
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        data: {
          error: message || "Something went wrong",
        },
      };
    }
  }
}
