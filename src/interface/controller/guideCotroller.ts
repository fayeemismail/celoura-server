import { Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { env } from "../../config/authConfig";
import { HttpStatusCode } from "../../application/constants/httpStatus";
import { UserRepository } from "../../infrastructure/database/repositories/UserRepository";



export default class  GuideController {
    
    private userRepo = new UserRepository();
    constructor() {}

    public guideRefreshAccessToken = (req: Request, res: Response): any => {
        const token = req.cookies?.guideRefreshToken;
        if(!token) {
            return res.status(401).json({ error: "Refresh token is missing" });
        }

        try {
            const payload = jwt.verify(token, env.JWT_REFRESH_SECRET!) as JwtPayload;

            if(!payload || typeof payload == 'string' || !payload.id) {
                return res.status(403).json({ error: 'Invalid token payload' });
            }

            const newAccessToken = jwt.sign({ id: payload.id }, env.JWT_ACCESS_SECRET!, {
                expiresIn: '15m'
            });

            res.cookie('guideAccessToken', newAccessToken, {
                httpOnly: true,
                secure: env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: env.ACCESS_TOKEN_EXPIRE,
            });

            return res.status(HttpStatusCode.OK).json({ success: true });
        } catch (error) {
            console.error("Admin refresh Error: ", error);
            return res.status(403).json({ error: 'Invalid admin refresh token' });
        }
    }
    public getCurrentUser = async (req: Request, res: Response): Promise<any> => {
        try {
            const userId = req.query.id;
            console.log(userId)
            if (!userId || typeof userId !== 'string') {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const user = await this.userRepo.getUserById(userId);
            if (!user) return res.status(404).json({ error: 'User not found' });

            const userData = {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            };

            res.status(HttpStatusCode.OK).json({ data: userData });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    };
}