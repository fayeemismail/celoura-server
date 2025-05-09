

export interface IEmailService {
    sendOtpEmail(email: string, otp: string): Promise<void>;
}