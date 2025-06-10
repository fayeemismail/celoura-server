import { Request, Response } from "express";
import { GetAllUserUseCase } from "../../application/usecase/admin/GetAllUserUseCase";
import { HttpStatusCode } from "../../application/constants/httpStatus";
import { env } from "../../config/authConfig";
import { JwtPayload } from "jsonwebtoken";
import jwt from 'jsonwebtoken'
import { BlockUserUseCase } from "../../application/usecase/user/BlockUserUseCase";
import { UserRepository } from "../../infrastructure/database/repositories/UserRepository";
import { UnBlockUserUseCase } from "../../application/usecase/user/UnBlockUserUseCase";
import { GuideApplication } from "../../domain/entities/GuideApplication";
import { GetAllGuideAppliesUseCase } from "../../application/usecase/admin/GetAllGuideAppliesUseCase";
import { ApproveAsGuideUseCase } from "../../application/usecase/admin/ApproveAsGuideUseCase";
import { RejectAsGuideUseCase } from "../../application/usecase/admin/RejectAsGuideUseCase";




export default class AdminContrller {
    constructor(
        private getAllUserUseCase: GetAllUserUseCase,
        private userRepo: UserRepository
    ) { };

    public getAllUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const role = req.query.role as 'user' | 'guide' || 'user';



            const { data, total } = await this.getAllUserUseCase.execute(page, limit, role);
            res.status(HttpStatusCode.OK).json({
                status: true,
                data,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            });
        } catch (error: unknown) {
            console.error("GetAllUsers Error:", error);
            res.status(500).json({ status: false, message: "Internal Server Error" });
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
            if (!userId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'User not found' });

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
            if (!userId) res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "User Not Found" });

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
    };

    public getGuideApplications = async (req: Request, res: Response): Promise<any> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const applicationUseCase = new GetAllGuideAppliesUseCase();
            const { data, total, totalPages } = await applicationUseCase.execute(page, limit);

            return res.status(HttpStatusCode.OK).json({
                data,
                total,
                page,
                totalPages
            });
        } catch (error: any) {
            console.log(error.message);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }


    public approveGuide = async (req: Request, res: Response): Promise<void> => {
        const { applicationId, userId } = req.body;
        try {
            if (!applicationId) {
                res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Application not found' });
                return
            }
            if (!userId) {
                res.status(HttpStatusCode.NOT_FOUND).json({ message: 'User Not found' });
                return
            }
            const approveUseCase = new ApproveAsGuideUseCase(this.userRepo);
            await approveUseCase.execute(applicationId, userId);

            res.status(HttpStatusCode.OK).json({ message: 'Approves as guide Successfully' })
        } catch (error: any) {
            console.log(error.message)
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message })
        }
    }

    public rejectGuide = async (req: Request, res: Response): Promise<any> => {
        const { applicationId, userId } = req.body
        try {
            if (!applicationId) {
                res.status(HttpStatusCode.NOT_FOUND).json({ message: 'application not found' });
                return
            }

            if (!userId) {
                res.status(HttpStatusCode.NOT_FOUND).json({ message: "User not found" });
                return;
            };
            console.log(applicationId, 'and', userId)
            const rejectUseCase = new RejectAsGuideUseCase(this.userRepo);
            await rejectUseCase.execute(applicationId, userId);

            res.status(HttpStatusCode.OK).json({ message: 'Application Rejected successfully' });
        } catch (error: any) {
            console.log(error.message);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    public getCount = async (req: Request, res: Response) => {
        try {
            const response = await this.userRepo.findAll()
            const users = response.filter((item) => item.role == 'user');
            const guide = response.filter((item) => item.role == 'guide');
            res.status(HttpStatusCode.OK).json({
                status: true, data: { users, guide }
            })
        } catch (error: any) {
            console.log('Error On geting count: ', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: error.message || 'Failed to Fetch users'
            })
        }
    }
}