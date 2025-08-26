import transporter from "../../config/emailConfig";
import { IEmailService } from "../../application/interfaces/services/IEmailService";


export class EmailService implements IEmailService {
    async sendOtpEmail(email: string, otp: string): Promise<void> {
        const mailOptions = {
            from: `"Celoura Travel" celouratravels@gmail.com`, 
            to: email,
            subject: 'Your Celoura OTP Code',
            text: `Your OTP code is ${otp}. It will expire in 1.5 minutes.`,
            html: `
                <div style="font-family: sans-serif; color: #333;">
                    <h2>Celoura OTP Verification</h2>
                    <p>Your OTP code is: <strong style="font-size: 1.5rem;">${otp}</strong></p>
                    <p>This code will expire in 1.5 minutes.</p>
                    <br/>
                    <p>If you didn't request this, please ignore.</p>
                </div>
            `
        };
        await transporter.sendMail(mailOptions)
    };
    async sendGuideRejectionEmail(email: string, reason: string): Promise<void> {
        const mailOptions = {
            from: `"Celoura Travel" <celouratravels@gmail.com>`,
            to: email,
            subject: 'Guide Application Status – Rejected',
            text: `Unfortunately, your application to become a guide has been rejected. Reason: ${reason}`,
            html: `
                <div style="font-family: sans-serif; color: #333;">
                    <h2>Guide Application Update</h2>
                    <p>Dear Applicant,</p>
                    <p>Thank you for your interest in becoming a guide at <strong>Celoura Travel</strong>.</p>
                    <p>Unfortunately, your application has been <span style="color:red;font-weight:bold;">rejected</span>.</p>
                    <p><strong>Reason:</strong> ${reason}</p>
                    <br/>
                    <p>You may improve your profile and reapply in the future.</p>
                    <p>Best Regards,<br/>Celoura Travel Team</p>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
    }

    async sentForgotPasswordOtpEmail(email: string, otp: string): Promise<void> {
    const mailOptions = {
        from: `"Celoura Travel" <celouratravels@gmail.com>`,
        to: email,
        subject: 'Password Reset OTP - Celoura Travel',
        text: `You requested a password reset. Your OTP code is ${otp}. It will expire in 10 minutes.`,
        html: `
            <div style="font-family: sans-serif; color: #333;">
                <h2>Password Reset Request</h2>
                <p>We received a request to reset your password for your <strong>Celoura Travel</strong> account.</p>
                <p>Your OTP code is: <strong style="font-size: 1.5rem;">${otp}</strong></p>
                <p>This code will expire in <strong>10 minutes</strong>.</p>
                <br/>
                <p>If you did not request this, please ignore this email. Your account is still secure.</p>
                <br/>
                <p>Best Regards,<br/>Celoura Travel Team</p>
            </div>
        `
    };
    await transporter.sendMail(mailOptions);
}

}