import { NextFunction, Request, Response } from "express";
import { jwtVerify } from "../service/jwtService";
import { HttpStatusCode } from "../../application/constants/httpStatus";



export const authenticate = (req: Request, res: Response, next: NextFunction): any => {
    const token = req.cookies?.accessToken;
    if(!token) return res.status(HttpStatusCode.UNAUTHORIZED).json({ error: 'Access token missing' });

    try {
        const decoded = jwtVerify(token);
        (req as any).user = decoded;
        next()
    } catch (error: any) {
        console.log(error.message)
        res.status(HttpStatusCode.FORBIDDEN).json({ error: 'invalid or expired token' });
    }
};