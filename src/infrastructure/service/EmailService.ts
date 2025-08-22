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
}