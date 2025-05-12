import { env } from "../../config/authConfig";
import jwt from 'jsonwebtoken';



const guideAccessTokenSecret = env.JWT_ACCESS_SECRET;

export const guideJwtVerify = (token: string) => {
    if(guideAccessTokenSecret) {
        const response = jwt.verify(token, guideAccessTokenSecret);
        return response;
    }

    console.log("No guide Access Secret");
    throw new Error('No Guide Access token Secret')
}