import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../../application/constants/httpStatus";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
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
import { IDeleteDestinationUseCase } from "../../application/usecase/admin/interface/IDeleteDestinationUseCase";
import { IGenerateSignedUrlUseCase } from "../../application/usecase/admin/interface/IGenarateSignedUrlUseCase";
import { UserMapper } from "../../application/mappers/admin/userMapper";
import { IFetchAllBookingsUseCase } from "../../application/usecase/admin/interface/IFetchAllBookingsUseCase";

export default class AdminController {
  constructor(
    private readonly _getAllUserUseCase: IGetAllUserUseCase,
    private readonly _blockUserUseCase: IBlockUserUseCase,
    private readonly _unBlockUserUseCase: IUnBlockUserUseCase,
    private readonly _getAllGuideAppliesUseCase: IGetAllGuideApplies,
    private readonly _approveAsGuideUseCase: IApproveAsGuide,
    private readonly _rejectAsGuideUseCase: IRejectAsGuide,
    private readonly _createDestinationUseCase: ICreateDestintaion,
    private readonly _getAllDestinationsUseCase: IGetAllDestinations,
    private readonly _getCountUseCase: IGetCountUseCase,
    private readonly _getDestinationUseCase: IGetDestinationUseCase,
    private readonly _editDestinationUseCase: IEditDestinationUseCase,
    private readonly _deleteDestinationUseCase: IDeleteDestinationUseCase,
    private readonly _generateSignedUrlsUseCase: IGenerateSignedUrlUseCase,
    private readonly _fetchAllBookingsUseCase: IFetchAllBookingsUseCase
  ) {}

  public getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const role = (req.query.role as "user" | "guide") || "user";
      const search = (req.query.search as string) || "";

      const { data, total } = await this._getAllUserUseCase.execute(page, limit, role, search);
      const userguides = UserMapper.toDTOList(data);

      res.status(HttpStatusCode.OK).json({
        status: true,
        data: userguides,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public adminRefreshAccessToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.adminRefreshToken;
    if (!token) {
      res.status(HttpStatusCode.UNAUTHORIZED).json({ error: "Refresh token is missing" });
    }

    try {
      const payload = jwt.verify(token, env.JWT_REFRESH_SECRET!) as JwtPayload;

      if (!payload || typeof payload == "string" || !payload.id) {
        res.status(HttpStatusCode.FORBIDDEN).json({ error: "Invalid token payload" });
      }

      const newAccessToken = jwt.sign({ id: payload.id }, env.JWT_ACCESS_SECRET!, {
        expiresIn: "15m",
      });

      res.cookie("adminAccessToken", newAccessToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: env.ACCESS_TOKEN_EXPIRE,
        path: "/",
      });

      res.status(HttpStatusCode.OK).json({ success: true });
    } catch (error) {
      next(error);
    }
  };

  public blockUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      if (!userId) res.status(HttpStatusCode.BAD_REQUEST).json({ message: "User not found" });

      await this._blockUserUseCase.execute(userId);
      res.status(HttpStatusCode.OK).json({ message: "User blocked successfully" });
    } catch (error) {
      next(error);
    }
  };

  public unBlockUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      if (!userId) res.status(HttpStatusCode.BAD_REQUEST).json({ message: "User not found" });

      await this._unBlockUserUseCase.execute(userId);
      res.status(HttpStatusCode.OK).json({ message: "User unblocked successfully" });
    } catch (error) {
      next(error);
    }
  };

  public getGuideApplications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { data, total, totalPages } = await this._getAllGuideAppliesUseCase.execute(page, limit);
      res.status(HttpStatusCode.OK).json({ data, total, page, totalPages });
    } catch (error) {
      next(error);
    }
  };

  public approveGuide = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { applicationId, userId } = req.body;
      if (!applicationId || !userId) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Application or User not found" });
      }

      await this._approveAsGuideUseCase.execute(applicationId, userId);
      res.status(HttpStatusCode.OK).json({ message: "Approved as guide successfully" });
    } catch (error) {
      next(error);
    }
  };

  public rejectGuide = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { applicationId, userId, reason } = req.body;
      if (!applicationId || !userId) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Application or User not found" });
      }

      await this._rejectAsGuideUseCase.execute(applicationId, userId, reason);
      res.status(HttpStatusCode.OK).json({ message: "Application rejected successfully" });
    } catch (error) {
      next(error);
    }
  };

  public getCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = await this._getCountUseCase.findUser();
      const guideData = await this._getCountUseCase.findGuide();
      const destination = await this._getCountUseCase.findDestination();

      res.status(HttpStatusCode.OK).json({
        user: UserMapper.toDTOList(userData),
        guide: UserMapper.toDTOList(guideData),
        destination,
      });
    } catch (error) {
      next(error);
    }
  };

  public createDestination = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description, location, country, features, photos } = req.body;
      const parsedFeatures = typeof features === "string" ? JSON.parse(features) : features;
      const parsedPhotos = typeof photos === "string" ? JSON.parse(photos) : photos;

      if (!Array.isArray(parsedPhotos) || parsedPhotos.length === 0) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ message: "At least one photo URL is required" });
      }

      const destination = await this._createDestinationUseCase.execute(
        name,
        location,
        country,
        description,
        parsedPhotos,
        parsedFeatures
      );

      res.status(HttpStatusCode.CREATED).json({ message: "Destination created successfully", data: destination });
    } catch (error) {
      next(error);
    }
  };

  public generateSignedUrls = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { count } = req.query;
      const photoCount = parseInt(count as string, 10);

      const signedUrls = await this._generateSignedUrlsUseCase.execute(photoCount);
      res.status(HttpStatusCode.OK).json({ signedUrls });
    } catch (error) {
      next(error);
    }
  };

  public getAllDestinations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this._getAllDestinationsUseCase.findAll();
      res.status(HttpStatusCode.OK).json({ data: response });
    } catch (error) {
      next(error);
    }
  };

  public getPaginatedDestinations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 9;
      const search = req.query.search?.toString() || "";
      const attraction = req.query.attraction?.toString() || "";

      const { data, total } = await this._getAllDestinationsUseCase.execute(page, limit, search, attraction);

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
      next(error);
    }
  };

  public getDestination = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { destinationId } = req.params;
      if (!destinationId) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ message: "DestinationId parameter is required" });
      }

      const data = await this._getDestinationUseCase.execute(destinationId);
      res.status(HttpStatusCode.OK).json({ data });
    } catch (error) {
      next(error);
    }
  };

  public editDestination = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { destinationId } = req.params;
      const editedData = req.body;
      const files = req.files as Express.Multer.File[];

      const update = await this._editDestinationUseCase.execute(destinationId, { ...editedData, files });
      res.status(HttpStatusCode.OK).json({ message: update.message, data: update.data });
    } catch (error) {
      next(error);
    }
  };

  public deleteDestination = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { destinationId } = req.params;
      const result = await this._deleteDestinationUseCase.execute(destinationId);
      res.status(HttpStatusCode.NO_CONTENT).json({ message: result.message });
    } catch (error) {
      next(error);
    }
  };

  public fetchBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 9;

      const result = await this._fetchAllBookingsUseCase.execute(page, limit);
      res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
      next(error);
    }
  };
}
