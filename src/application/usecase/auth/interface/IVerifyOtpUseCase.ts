import { User } from "../../../../domain/entities/User";



export interface OtpInput {
  email: string;
  otp: string;
}

export interface IVerifyOtpUseCase {
  execute(input: OtpInput): Promise<{status: number; data: { message?: string; error?: string; savedUser?: User}}>;
}
