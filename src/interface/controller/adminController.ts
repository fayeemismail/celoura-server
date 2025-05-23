import { Request, Response } from "express";
import { GetAllUserUseCase } from "../../application/usecase/admin/GetAllUserUseCase";
import { HttpStatusCode } from "../../application/constants/httpStatus";
import { env } from "../../config/authConfig";
import { JwtPayload } from "jsonwebtoken";
import jwt from 'jsonwebtoken'
import { BlockUserUseCase } from "../../application/usecase/user/BlockUserUseCase";
import { UserRepository } from "../../infrastructure/database/repositories/UserRepository";
import { UnBlockUserUseCase } from "../../application/usecase/user/UnBlockUserUseCase";




export default class AdminContrller {
    constructor(
        private getAllUserUseCase: GetAllUserUseCase,
        private userRepo: UserRepository
    ) { };

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
            return res.status(HttpStatusCode.UNAUTHORIZED).json({ error: 'Refresh token is missing' });
        }
        try {
            const payload = jwt.verify(token, env.JWT_REFRESH_SECRET!) as JwtPayload;

            if (!payload || typeof payload == 'string' || !payload.id) {
                return res.status(HttpStatusCode.FORBIDDEN).json({ error: 'Invalid token payload' });
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

            
            return res.status(HttpStatusCode.OK).json({ success: true });
        } catch (error) {
            console.error('Admin Refresh Error: ', error);
            return res.status(HttpStatusCode.FORBIDDEN).json({ error: "Invalid admin refresh token" });
        }
    };

    public blockUser = async (req: Request, res: Response): Promise<any> => {
        const { userId } = req.params;
        try {
            if(!userId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'User not found' });

            const userUseCase = new BlockUserUseCase(this.userRepo);
            await userUseCase.execute(userId);

            return res.status(HttpStatusCode.OK).json({
                message: 'User Has been Blocked successfully'
            })
        } catch (error: any) {
            console.log(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                message: error.message || 'Failed to Block user'
            })
        }
    }

    public unBlockUser = async (req: Request, res: Response): Promise<any> => {
        const { userId } = req.params;
        try {
            if(!userId) res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "User Not Found" });

            const userUseCase = new UnBlockUserUseCase(this.userRepo);
            await userUseCase.execute(userId);
            res.status(HttpStatusCode.OK).json({
                message: 'UnBlocked User'
            })
        } catch (error: any) {
            console.log(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                message: error.message || 'Failed to unBlock User'
            })
        }
    }


}