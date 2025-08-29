

export interface IEmailService {
    sendOtpEmail(email: string, otp: string): Promise<void>;
    sendGuideRejectionEmail(email: string, reason: string): Promise<void>;
    sentForgotPasswordOtpEmail(email: string, otp: string): Promise<void>;
}