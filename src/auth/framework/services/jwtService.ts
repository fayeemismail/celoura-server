import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN!;

export const generateAccessToken = ( payload: object ): string => {
    return jwt.sign( payload, JWT_SECRET, { expiresIn: '15m' } );
};

export const generateRefreshToken = ( payload: object ): string => {
    return jwt.sign( payload, REFRESH_SECRET, { expiresIn: '7d' } )
};