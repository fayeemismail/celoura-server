import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
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
import { ILikePostUseCase } from "../../application/usecase/guide/Interface/ILikePostUseCase";
import { IUnlikePostUseCase } from "../../application/usecase/guide/Interface/IUnlikePostUseCase";
import { ICommentPostUseCase } from "../../application/usecase/guide/Interface/ICommentPostUseCase";
import { IReplyCommentUseCase } from "../../application/usecase/guide/Interface/IReplyCommentUseCase";
import { IGetDetailedDestination } from "../../application/usecase/guide/Interface/IGetDetailedDestination";
import { IAddToAvailableDestinationUseCase } from "../../application/usecase/guide/Interface/IAddToAvailableDestinationUseCase";
import { IFetchBookingsUseCase } from "../../application/usecase/guide/Interface/IFetchBookingsUseCase";
import { IFetchBookingDetailsUseCase } from "../../application/usecase/guide/Interface/IFetchBookingDetailsUseCase";
import { IAcceptBookingUseCase } from "../../application/usecase/guide/Interface/IAcceptBookingUseCase";
import { IRejectBookingUseCase } from "../../application/usecase/guide/Interface/IRejectBookingUseCase";

export default class GuideController {
  constructor(
    private readonly _getGuideProfileUseCase: IGetGuideProfile,
    private readonly _getCurrentGuideUseCase: IGetUserProfile,
    private readonly _getDestinationUseCase: IGetAllPaginatedDestinationUseCase,
    private readonly _editGuideProfileUseCase: IEditGuideProfileUseCase,
    private readonly _createnewPostUseCase: ICreateNewPostUseCase,
    private readonly _getAllPostGuideUseCase: IGetAllPostGuide,
    private readonly _getSinglePostUseCase: IGetSinglePostUseCase,
    private readonly _likePostUseCase: ILikePostUseCase,
    private readonly _unlikePostUseCase: IUnlikePostUseCase,
    private readonly _commentPostUseCase: ICommentPostUseCase,
    private readonly _replyCommentUseCase: IReplyCommentUseCase,
    private readonly _getDestinationDetailed: IGetDetailedDestination,
    private readonly _addToMyDestinationUseCase: IAddToAvailableDestinationUseCase,
    private readonly _fetchBookingUseCase: IFetchBookingsUseCase,
    private readonly _fetchBookingDetailsUseCase: IFetchBookingDetailsUseCase,
    private readonly _acceptBookingUseCase: IAcceptBookingUseCase,
    private readonly _rejectBookingUseCase: IRejectBookingUseCase
  ) {}

  public guideRefreshAccessToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.guideRefreshToken;
    if (!token) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ error: "Refresh token is missing" });
    }

    try {
      const payload = jwt.verify(token, env.JWT_REFRESH_SECRET!) as JwtPayload;

      if (!payload || typeof payload == "string" || !payload.id) {
        return res.status(HttpStatusCode.FORBIDDEN).json({ error: "Invalid token payload" });
      }

      const newAccessToken = jwt.sign({ id: payload.id }, env.JWT_ACCESS_SECRET!, {
        expiresIn: "15m",
      });

      res.cookie("guideAccessToken", newAccessToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: env.ACCESS_TOKEN_EXPIRE,
      });

      res.status(HttpStatusCode.OK).json({ success: true });
    } catch (error) {
      next(error);
    }
  };

  public getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.query.id;
      if (!userId || typeof userId !== "string") {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({ error: "Unauthorized" });
      }

      const user = await this._getCurrentGuideUseCase.execute(userId);
      if (!user) return res.status(HttpStatusCode.NOT_FOUND).json({ error: "User not found" });

      const userDTO = GuideDataDto.formDomain(user);
      res.status(HttpStatusCode.OK).json({ data: userDTO });
    } catch (error) {
      next(error);
    }
  };

  public getPaginatedDestination = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      const search = req.query.search?.toString() || "";
      const attraction = req.query.attraction?.toString() || "";

      const { data, total } = await this._getDestinationUseCase.execute(page, limit, search, attraction);

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

  public getNewDestinations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = parseInt(req.params.limit as string) || 4;
      const data = await this._getDestinationUseCase.getNew(limit);
      if (!data) return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Something went wrong" });

      res.status(HttpStatusCode.OK).json(data);
    } catch (error) {
      next(error);
    }
  };

  public guideProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const response = await this._getGuideProfileUseCase.findById(id);
      if (!response) return res.status(HttpStatusCode.NOT_FOUND).json({ message: "User not found" });

      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  public guideProfileUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const file = req.file;

      if (!data) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Something went wrong on update" });
      }

      const updatedData = {
        ...data,
        profilePic: file ? file : undefined,
      };

      const response = await this._editGuideProfileUseCase.execute(updatedData);
      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  public createNewPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const files = req.files;
      const fullData = { ...data, photos: files ? files : undefined };
      const response = await this._createnewPostUseCase.execute(fullData);

      res.status(HttpStatusCode.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getGuideAllPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const guideId = req.params.guideId;
      const response = await this._getAllPostGuideUseCase.execute(guideId);
      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getSinglePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = req.params.postId;
      const response = await this._getSinglePostUseCase.execute(postId);
      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  public likePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = req.params.postId;
      const userId = req.params.userId;
      await this._likePostUseCase.execute(postId, userId);
      res.status(HttpStatusCode.CREATED).json({ success: true });
    } catch (error) {
      next(error);
    }
  };

  public unlikePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = req.params.postId;
      const userId = req.params.userId;
      await this._unlikePostUseCase.execute(postId, userId);
      res.status(HttpStatusCode.NO_CONTENT).json({ success: true });
    } catch (error) {
      next(error);
    }
  };

  public addComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const newComment = await this._commentPostUseCase.execute(data);
      res.status(HttpStatusCode.CREATED).json(newComment);
    } catch (error) {
      next(error);
    }
  };

  public replyComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const response = await this._replyCommentUseCase.execute(data);
      res.status(HttpStatusCode.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  };

  public detailedDestination = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const destinationId = req.params.destinationId;
      const data = await this._getDestinationDetailed.execute(destinationId);
      res.status(HttpStatusCode.OK).json(data);
    } catch (error) {
      next(error);
    }
  };

  public addToMyDestination = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const destinationId = req.params.destinationId;
      const guideId = req.params.guideId;
      await this._addToMyDestinationUseCase.execute(destinationId, guideId);
      res.status(HttpStatusCode.OK).json({ success: true });
    } catch (error) {
      next(error);
    }
  };

  public fetchBookigs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const guideId = req.params.guideId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 1;
      const search = (req.query.search as string) || "";
      const status = (req.query.status as string) || "";

      const { data, total } = await this._fetchBookingUseCase.execute(guideId, page, limit, search, status);
      res.status(HttpStatusCode.OK).json({ data, total });
    } catch (error) {
      next(error);
    }
  };

  public fetchBookingDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookingId = req.params.bookingId;
      const data = await this._fetchBookingDetailsUseCase.execute(bookingId);
      res.status(HttpStatusCode.OK).json(data);
    } catch (error) {
      next(error);
    }
  };

  public acceptBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookingId = req.params.bookingId;
      const { budget } = req.body;
      const data = await this._acceptBookingUseCase.execute(bookingId, budget);
      res.status(HttpStatusCode.OK).json(data);
    } catch (error) {
      next(error);
    }
  };

  public rejectBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookingId = req.params.bookingId;
      const { reason } = req.body;
      const data = await this._rejectBookingUseCase.execute(bookingId, reason);
      res.status(HttpStatusCode.OK).json(data);
    } catch (error) {
      next(error);
    }
  };
}
