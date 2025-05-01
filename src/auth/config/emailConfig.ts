import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { env } from './authConfig';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: env.COMPANY_EMAIL,
        pass: env.EMAIL_PASSKEY
    },
});

export default transporter;