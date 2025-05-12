import { NextFunction, Request, Response } from "express";
import { guideJwtVerify } from "../../shared/utility/guideJwtService";



export const guideAuthenticate = (req: Request, res: Response, next: NextFunction): any => {
    const token = req.cookies?.guideAccessToken;
    if ( !token ) {
        return res.status(401).json({ error: "Guide Access token is missing" })
    }

    try {
        const decoded = guideJwtVerify(token);
        (req as any).guide = decoded;
        next();
    } catch (error: any) {
        console.log(error.message);
        res.status(403).json({ error: 'Invalid or expired Guide token' })
    }
}