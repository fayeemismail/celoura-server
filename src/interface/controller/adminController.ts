import { Request, Response } from "express";
import { GetAllUserUseCase } from "../../application/usecase/admin/GetAllUserUseCase";
import { HttpStatusCode } from "../../application/constants/httpStatus";
import { env } from "../../config/authConfig";
import { JwtPayload } from "jsonwebtoken";
import jwt from 'jsonwebtoken'




export default class AdminContrller {
    constructor(private getAllUserUseCase: GetAllUserUseCase) { };

    public getAllUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const data = await this.getAllUserUseCase.execute();
            const users = data.filter((item) => item.role == 'user');
            const guide = data.filter((item) => item.role == 'guide');
            res.status(HttpStatusCode.OK).json({ status: true, data: {users, guide} });
        } catch (error: unknown) {

        }
    }


    public adminRefreshAccessToken = (req: Request, res: Response): any => {
        const token = req.cookies?.adminRefreshToken;
        if (!token) {
            return res.status(401).json({ error: 'Refresh token is missing' });
        }
        try {
            const payload = jwt.verify(token, env.JWT_REFRESH_SECRET!) as JwtPayload;

            if (!payload || typeof payload == 'string' || !payload.id) {
                return res.status(403).json({ error: 'Invalid token payload' });
            }

            const newAccessToken = jwt.sign({ id: payload.id }, env.JWT_ACCESS_SECRET!, {
                expiresIn: '15m'
            });

            res.cookie('adminAccessToken', newAccessToken, {
                httpOnly: true,
                secure: env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: env.ACCESS_TOKEN_EXPIRE,
                path: '/', 
            });

            
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('Admin Refresh Error: ', error);
            return res.status(403).json({ error: "Invalid admin refresh token" });
        }
    };

    public blockUser = async (req: Request, res: Response): Promise<any> => {
        const { userId } = req.params
        try {
            console.log(userId);
        } catch (error) {
            console.log(error);
        }
    }


}