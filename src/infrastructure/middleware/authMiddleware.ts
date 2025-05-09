import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { env } from "../../config/authConfig";
import { jwtVerify } from "../../shared/utility/jwtService";



export const authenticate = (req: Request, res: Response, next: NextFunction): any => {
    const token = req.cookies?.accessToken;
    if(!token) return res.status(401).json({ error: 'Access token missing' });

    try {
        const decoded = jwtVerify(token);
        (req as any).user = decoded;
        next()
    } catch (error: any) {
        console.log(error.message)
        res.status(403).json({ error: 'invalid or expired token' });        
    }
}