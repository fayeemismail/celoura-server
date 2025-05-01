import { IAuthService } from "../../domain/interfaces/IAuthService";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const  SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN!;

export class AuthService implements IAuthService {
    
    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, SALT_ROUNDS)
    }

    async comparePasswords(plain: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plain, hash);
    }

    generateAccessToken(payload: object): string {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' } );
    };

    generateRefreshToken(payload: object): string {
        return jwt.sign( payload, REFRESH_SECRET, { expiresIn: '7d' } );
    }
}