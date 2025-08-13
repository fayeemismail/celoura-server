import { Request, Response } from "express";
import { HttpStatusCode } from "../../application/constants/httpStatus";
import { JwtPayload } from "jsonwebtoken";
import jwt from 'jsonwebtoken';
import { env } from "../../config/authConfig";
import { IGetAllUserUseCase } from "../../application/usecase/admin/interface/IGetAllUserUseCase";
import { IBlockUserUseCase } from "../../application/usecase/user/interface/IBlockUserUseCase";
import { IUnBlockUserUseCase } from "../../application/usecase/user/interface/IUnBlockUserUseCase";
import { IGetAllGuideApplies } from "../../application/usecase/admin/interface/IGetAllGuideApplies";
import { IRejectAsGuide } from "../../application/usecase/admin/interface/IRejectAsGuide";
import { ICreateDestintaion } from "../../application/usecase/admin/interface/ICreateDestination";
import { IGetAllDestinations } from "../../application/usecase/admin/interface/IGetAllDestinations";
import { IApproveAsGuide } from "../../application/usecase/admin/interface/IApproveAsGuide";
import { IGetCountUseCase } from "../../application/usecase/admin/interface/IGetCountUseCase";
import { IGetDestinationUseCase } from "../../application/usecase/admin/interface/IGetDestinationUseCase";
import { IEditDestinationUseCase } from "../../application/usecase/admin/interface/IEditDestinationUseCase";
import { extractErrorMessage } from "../../utils/errorHelpers";
import { IDeleteDestinationUseCase } from "../../application/usecase/admin/interface/IDeleteDestinationUseCase";
import { v4 as uuidv4 } from 'uuid';
import { s3Client } from "../../config/s3Config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { IGenerateSignedUrlUseCase } from "../../application/usecase/admin/interface/IGenarateSignedUrlUseCase";

export default class AdminController {
    constructor(
        private readonly getAllUserUseCase: IGetAllUserUseCase,
        private readonly blockUserUseCase: IBlockUserUseCase,
        private readonly unBlockUserUseCase: IUnBlockUserUseCase,
        private readonly getAllGuideAppliesUseCase: IGetAllGuideApplies,
        private readonly approveAsGuideUseCase: IApproveAsGuide,
        private readonly rejectAsGuideUseCase: IRejectAsGuide,
        private readonly createDestinationUseCase: ICreateDestintaion,
        private readonly getAllDestinationsUseCase: IGetAllDestinations,
        private readonly getCountUseCase: IGetCountUseCase,
        private readonly getDestinationUseCase: IGetDestinationUseCase,
        private readonly editDestinationUseCase: IEditDestinationUseCase,
        private readonly deleteDestinationUseCase: IDeleteDestinationUseCase,
        private readonly _generateSignedUrlsUseCase : IGenerateSignedUrlUseCase
    ) { }

    public getAllUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const role = req.query.role as 'user' | 'guide' || 'user';
            const search = (req.query.search as string) || '';

            const { data, total } = await this.getAllUserUseCase.execute(page, limit, role, search);
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
        } catch (error) {
            console.error("GetAllUsers Error:", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: "Internal Server Error" });
        }
    };

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
            await this.blockUserUseCase.execute(userId);
            return res.status(HttpStatusCode.OK).json({ message: 'User Has been Blocked successfully' });
        } catch (error: any) {
            console.log(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message || 'Failed to Block user' });
        }
    };

    public unBlockUser = async (req: Request, res: Response): Promise<any> => {
        const { userId } = req.params;
        try {
            if (!userId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "User Not Found" });
            await this.unBlockUserUseCase.execute(userId);
            res.status(HttpStatusCode.OK).json({ message: 'UnBlocked User' });
        } catch (error: any) {
            console.log(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message || 'Failed to unBlock User' });
        }
    };

    public getGuideApplications = async (req: Request, res: Response): Promise<any> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const { data, total, totalPages } = await this.getAllGuideAppliesUseCase.execute(page, limit);
            return res.status(HttpStatusCode.OK).json({ data, total, page, totalPages });
        } catch (error: any) {
            console.log(error.message);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    };

    public approveGuide = async (req: Request, res: Response): Promise<void> => {
        const { applicationId, userId } = req.body;
        try {
            if (!applicationId || !userId) {
                res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Application or User not found' });
                return;
            }
            await this.approveAsGuideUseCase.execute(applicationId, userId);
            res.status(HttpStatusCode.OK).json({ message: 'Approved as guide Successfully' });
        } catch (error: any) {
            console.log(error.message);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    };

    public rejectGuide = async (req: Request, res: Response): Promise<any> => {
        const { applicationId, userId, reason } = req.body;
        console.log(reason)
        try {
            if (!applicationId || !userId) {
                res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Application or User not found' });
                return;
            }
            await this.rejectAsGuideUseCase.execute(applicationId, userId, reason);
            res.status(HttpStatusCode.OK).json({ message: 'Application Rejected successfully' });
        } catch (error: any) {
            console.log(error.message);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    };

    public getCount = async (req: Request, res: Response) => {
        try {
            const user = await this.getCountUseCase.findUser();
            const guide = await this.getCountUseCase.findGuide();
            const destination = await this.getCountUseCase.findDestination();
            res.status(HttpStatusCode.OK).json({ user, guide, destination });
        } catch (error: any) {
            console.log('Error On getting count: ', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message || 'Failed to Fetch users' });
        }
    };

    public createDestination = async (req: Request, res: Response): Promise<any> => {
    try {
      const { name, description, location, country, features, photos } = req.body;
      const parsedFeatures = typeof features === 'string' ? JSON.parse(features) : features;
      const parsedPhotos = typeof photos === 'string' ? JSON.parse(photos) : photos;

      if (!Array.isArray(parsedPhotos) || parsedPhotos.length === 0) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ message: "At least one photo URL is required" });
      }

      const destination = await this.createDestinationUseCase.execute(
        name,
        location,
        country,
        description,
        parsedPhotos,
        parsedFeatures
      );
        res.status(HttpStatusCode.CREATED).json({ message: 'Destination created successfully', data: destination });
    } catch (error: any) {
      console.error("Error on creating destination: ", error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message || 'Internal Server Error' });
    }
  };

  public generateSignedUrls = async (req: Request, res: Response): Promise<any> => {
    try {
      const { count } = req.query; 
      const photoCount = parseInt(count as string, 10);

      const signedUrls = await this._generateSignedUrlsUseCase.execute(photoCount);

        res.status(HttpStatusCode.OK).json({ signedUrls });
    } catch (error) {
      console.error("Error generating signed URLs: ", error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to generate signed URLs" });
    }
  };

    public getAllDestinations = async (req: Request, res: Response) => {
        try {
            let response = await this.getAllDestinationsUseCase.findAll();
            res.status(HttpStatusCode.OK).json({ data: response });
        } catch (error: any) {
            console.log(error.message);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message || "CAN'T fetch the data" });
        }
    };

    public getPaginatedDestinations = async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 9;
            const search = req.query.search?.toString() || "";
            const attraction = req.query.attraction?.toString() || "";

            const { data, total } = await this.getAllDestinationsUseCase.execute(page, limit, search, attraction);

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
        } catch (error: any) {
            console.error("GetAllDestinations Error:", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: "Internal Server Error" });
        }
    };

    public getDestination = async (req: Request, res: Response) => {
        const { destinationId } = req.params;
        if (!destinationId) {
            res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'DestinationId parameter is required' });
            return;
        }

        try {
            const data = await this.getDestinationUseCase.execute(destinationId);
            res.status(HttpStatusCode.OK).json({ data });
        } catch (error: unknown) {
            console.error(error);

            if (error instanceof Error) {
                if (error.message === 'Invalid DestinationId') {
                    res.status(HttpStatusCode.BAD_REQUEST).json({ message: error.message });
                    return;
                }
                res.status(HttpStatusCode.NOT_FOUND).json({ message: error.message || 'Cannot find Destination' });
                return;
            }

            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' });
        }
    };


    public editDestination = async (req: Request, res: Response): Promise<any> => {
        const {destinationId} = req.params;
        const editedData = req.body;
        const files = req.files as Express.Multer.File[]
        try {
            const updatedData = {...editedData, files};
            console.log(updatedData, 'this is updated data');
            const update = await this.editDestinationUseCase.execute(destinationId, updatedData);

            if(!update){
                res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
                return;
            }

            res.status(HttpStatusCode.OK).json({ message: update.message, data: update.data })
        } catch (error: unknown) {
            const message = extractErrorMessage(error)
            console.error("Update error:", message);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: message || 'Internal Server Error' });
        }
    };

    public deleteDestination = async(req: Request, res: Response) => {
        const { destinationId } = req.params;
        try {
            const result = await this.deleteDestinationUseCase.execute(destinationId);
            res.status(HttpStatusCode.NO_CONTENT).json(result.message);
        } catch (error) {
            const message = extractErrorMessage(error)
            console.log(message);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({message : message})
        }
    };

}
