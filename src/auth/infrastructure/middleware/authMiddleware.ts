import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { env } from "../../config/authConfig";



export const authenticate = (req: Request, res: Response, next: NextFunction): any => {
    const token = req.cookies?.accessToken;
    if(!token) return res.status(401).json({ error: 'Access token missing' });

    try {
        const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET!);
        (req as any).user = decoded;
        next()
    } catch (error) {
        res.status(403).json({ error: 'invalid or expired token' });        
    }
}