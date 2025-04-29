import { env } from "../../config/authConfig";
import trasporter from "../../config/emailConfig";



export const sendOtpEmail = async (to: string, otp: string) => {
    const mailOptions = {
        from: `Celoure Travel  <${env.COMPANY_EMAIL}>`,
        to,
        subject: 'Your Celoura OTP Code',
        html: `
            <h1>OTP Verification</h1>
        <p>Your OTP code is: <strong>${otp}</strong></p>
        <p>This code will expire in 5 minutes.</p>
        `
    };
    await trasporter.sendMail(mailOptions)
}