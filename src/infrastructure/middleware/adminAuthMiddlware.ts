import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../application/constants/httpStatus";
import { adminJwtVerify } from "../../shared/utility/adminJwtService";



export const adminAuthenticate = (req: Request, res: Response, next: NextFunction): any => {
    const token = req.cookies?.adminAccessToken;
    if (!token) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({ error: "Admin Access token is missing" });
    }

    try {
        const decoded = adminJwtVerify(token);
        (req as any).admin = decoded;
        next();
    } catch (error: any) {
        console.log(error.message);
        res.status(HttpStatusCode.UNAUTHORIZED).json({ error: "Invalid or expired Admin token" });
    }
};
