import transporter from "../../config/emailConfig";
import { IEmailService } from "../../domain/interfaces/IEmailService";


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
    }
}