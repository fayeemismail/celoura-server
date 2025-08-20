import { NextFunction, Request, Response } from "express";
import { guideJwtVerify } from "../../shared/utility/guideJwtService";
import { extractErrorMessage } from "../../utils/errorHelpers";



export const guideAuthenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.guideAccessToken;
    if ( !token ) {
        res.status(401).json({ error: "Guide Access token is missing" });
        return
    }

    try {
        const decoded = guideJwtVerify(token);
        (req as any).guide = decoded;
        next();
    } catch (error) {
        const message = extractErrorMessage(error)
        console.log(message);
        res.status(403).json({ error: 'Invalid or expired Guide token' })
    }
}