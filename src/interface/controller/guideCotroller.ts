import { Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { env } from "../../config/authConfig";
import { HttpStatusCode } from "../../application/constants/httpStatus";
import { IGetGuideProfile } from "../../application/usecase/guide/Interface/IGetGuideProfileUseCase";
import { GuideDataDto } from "../../application/dto/guide/guideDataDto";
import { IGetUserProfile } from "../../application/usecase/user/interface/IGetUserProfileUseCase";
import { extractErrorMessage } from "../../utils/errorHelpers";
import { IGetAllPaginatedDestinationUseCase } from "../../application/usecase/guide/Interface/IGetPaginatedDestinationUseCase";
import { IEditGuideProfileUseCase } from "../../application/usecase/guide/Interface/IEditGuideProfileUseCase";
import { ICreateNewPostUseCase } from "../../application/usecase/guide/Interface/ICreateNewPostUseCase";
import { IGetAllPostGuide } from "../../application/usecase/guide/Interface/IGetAllPostGuide";
import { IGetSinglePostUseCase } from "../../application/usecase/guide/Interface/IGetSinglePostUseCase";



export default class GuideController {
    constructor(
        private readonly getGuideProfileUseCase: IGetGuideProfile,
        private readonly getCurrentGuideUseCase: IGetUserProfile,
        private readonly getDestinationUseCase: IGetAllPaginatedDestinationUseCase,
        private readonly editGuideProfileUseCase: IEditGuideProfileUseCase,
        private readonly createnewPostUseCase: ICreateNewPostUseCase,
        private readonly getAllPostGuideUseCase: IGetAllPostGuide,
        private readonly getSinglePostUseCase: IGetSinglePostUseCase,
    ) { }

    public guideRefreshAccessToken = (req: Request, res: Response) => {
        const token = req.cookies?.guideRefreshToken;
        if (!token) {
            res.status(HttpStatusCode.UNAUTHORIZED).json({ error: "Refresh token is missing" });
            return;
        }

        try {
            const payload = jwt.verify(token, env.JWT_REFRESH_SECRET!) as JwtPayload;

            if (!payload || typeof payload == 'string' || !payload.id) {
                res.status(HttpStatusCode.FORBIDDEN).json({ error: 'Invalid token payload' });
                return;
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

             res.status(HttpStatusCode.OK).json({ success: true });
        } catch (error) {
            console.error("Guide refresh Error: ", error);
            res.status(HttpStatusCode.FORBIDDEN).json({ error: 'Invalid admin refresh token' });
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
            const userDTO = GuideDataDto.formDomain(user);

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

    public getNewDestinations = async (req: Request, res: Response) => {
        const limit = parseInt(req.params.limit as string) || 4;
        try {
            const data = await this.getDestinationUseCase.getNew(limit)
            if (!data) res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Something went wrong" });
            res.status(HttpStatusCode.OK).json(data);
        } catch (error) {
            const message = extractErrorMessage(error);
            console.log(message);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: message || 'Internal server error' })
        }
    }

    public guideProfile = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const response = await this.getGuideProfileUseCase.findById(id);
            if (!response) {
                res.status(HttpStatusCode.NOT_FOUND).json({ message: "User not found" });
                return
            }
            res.status(HttpStatusCode.OK).json(response);
        } catch (error) {
            const message = extractErrorMessage(error);
            console.log(message || "something went wrong on guideProfile");
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: message || "Internal server error" })
        }
    }

    public guideProfileUpdate = async (req: Request, res: Response) => {
        const data = req.body
        const file = req.file
        try {
            if (!data) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Something went wrong on update" });
                return;
            };
            const updatedData = {
                ...data,
                profilePic: file ? file : undefined,
            };
            const response = await this.editGuideProfileUseCase.execute(updatedData);
            res.status(HttpStatusCode.OK).json(response);
        } catch (error: unknown) {
            console.log(error);
            if(error instanceof Error && error.message == "Current password is incorrect."){
                res.status(HttpStatusCode.BAD_REQUEST).json({ message: error.message });
                console.log(error.message);
                return;
            }
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" })
        }
    };

    public createNewPost = async(req: Request, res: Response) => {
        try {
            const data = req.body;
            const files = req.files;
            const fullData = { ...data, photos: files? files : undefined };
            const response = await this.createnewPostUseCase.execute(fullData);

            res.status(HttpStatusCode.CREATED).json(response);
        } catch (error) {
            console.log(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" })
        }
    };


    public getGuideAllPosts = async(req: Request, res: Response) => {
        const guideId = req.params.guideId;
        try {
            const response = await this.getAllPostGuideUseCase.execute(guideId);
            res.status(HttpStatusCode.OK).json(response);
        } catch (error) {
            console.log(error, 'this is error');
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Cannot find any posts" });
        }
    };

    public getSinglePost = async(req: Request, res: Response) => {
        const postId = req.params.postId;
        try {
            const response = await this.getSinglePostUseCase.execute(postId);
            res.status(HttpStatusCode.OK).json(response);
        } catch (error) {
            const message = extractErrorMessage(error);
            console.log(message, 'this is error')
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "something went wrong.." })
        }
    }
}