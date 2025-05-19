import { IAuthService } from "../../application/interfaces/services/IAuthService";
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN!;

export class AuthService implements IAuthService {

    generateAccessToken(payload: object): string {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' } );
    };

    generateRefreshToken(payload: object): string {
        return jwt.sign( payload, REFRESH_SECRET, { expiresIn: '7d' } );
    }

    verifyRefreshToken(token: string) {
        try {

            if(!REFRESH_SECRET) throw new Error('Refresh secret is not defined');
            return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
};