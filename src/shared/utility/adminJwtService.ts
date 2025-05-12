import { env } from "../../config/authConfig";
import jwt from 'jsonwebtoken';


const adminAccessTokenSecret = env.JWT_ACCESS_SECRET;

export const adminJwtVerify = (token: string) => {
    if(adminAccessTokenSecret) {
        const response = jwt.verify(token, adminAccessTokenSecret);
        return response;
    }

    console.log('no admin access Secret');
    throw new Error('No admin Access token Secret');
}