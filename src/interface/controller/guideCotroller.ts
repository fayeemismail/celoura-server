import { Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { env } from "../../config/authConfig";
import { HttpStatusCode } from "../../application/constants/httpStatus";
import { IGetGuideProfile } from "../../application/usecase/guide/Interface/IGetGuideProfileUseCase";
import { GuideProfileDto } from "../../application/dto/guide/guideProfileDto";
import { IGetUserProfile } from "../../application/usecase/user/interface/IGetUserProfileUseCase";
import { extractErrorMessage } from "../../utils/errorHelpers";
import { IGetAllPaginatedDestinationUseCase } from "../../application/usecase/guide/Interface/IGetPaginatedDestinationUseCase";



export default class GuideController {
    constructor(
        private readonly getGuideUseCase: IGetGuideProfile,
        private readonly getCurrentGuideUseCase: IGetUserProfile,
        private readonly getDestinationUseCase: IGetAllPaginatedDestinationUseCase
    ) { }

    public guideRefreshAccessToken = (req: Request, res: Response): any => {
        const token = req.cookies?.guideRefreshToken;
        if (!token) {
            return res.status(HttpStatusCode.UNAUTHORIZED).json({ error: "Refresh token is missing" });
        }

        try {
            const payload = jwt.verify(token, env.JWT_REFRESH_SECRET!) as JwtPayload;

            if (!payload || typeof payload == 'string' || !payload.id) {
                return res.status(HttpStatusCode.FORBIDDEN).json({ error: 'Invalid token payload' });
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
            console.error("Guide refresh Error: ", error);
            return res.status(HttpStatusCode.FORBIDDEN).json({ error: 'Invalid admin refresh token' });
        }
    }
    public getCurrentUser = async (req: Request, res: Response): Promise<any> => {
        try {
            const userId = req.query.id;
            console.log(userId)
            if (!userId || typeof userId !== 'string') {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({ error: 'Unauthorized' });
            }

            const user = await this.getCurrentGuideUseCase.execute(userId);
            if (!user) res.status(HttpStatusCode.NOT_FOUND).json({ error: 'User not found' })
            const userDTO = GuideProfileDto.formDomain(user);

            res.status(HttpStatusCode.OK).json({ data: userDTO });
        } catch (error) {
            const message = extractErrorMessage(error);
            console.log(message)
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: message || "Internal server error" });
        }
    };

    public getPaginatedDestination = async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 12;
            const search = req.query.search?.toString() || "";
            const attraction = req.query.attraction?.toString() || "";

            const { data, total } = await this.getDestinationUseCase.execute(page, limit, search, attraction);
            // console.log(data, total);
            res.status(HttpStatusCode.OK).json({
                status: true,
                data,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            })
        } catch (error) {
            const message = extractErrorMessage(error);
            console.log(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(message)
        }
    };

    public getNewDestinations = async(req: Request, res: Response) => {
        const limit  = parseInt(req.params.limit as string) || 4;
        try {
            const data = await this.getDestinationUseCase.getNew(limit)
            if(!data) res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Something went wrong" });
            res.status(HttpStatusCode.OK).json(data);
        } catch (error) {
            const message = extractErrorMessage(error);
            console.log(message);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: message || 'Internal server error' })
        }
    }
}