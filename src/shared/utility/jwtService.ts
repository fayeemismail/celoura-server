import jwt from 'jsonwebtoken'
import { env } from '../../config/authConfig'

const accessTokenSecret = env.JWT_ACCESS_SECRET;
// const refreshTokenSecret = env.JWT_REFRESH_SECRET; 

export const jwtVerify = (token: string) => {
    if(accessTokenSecret){
        const response = jwt.verify(token, accessTokenSecret)
        return response
    }
    console.log('no access secret');
    throw new Error('no access token secret');
}