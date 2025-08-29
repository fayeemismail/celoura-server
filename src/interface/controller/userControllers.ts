import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../../application/constants/httpStatus";
import { ValidationError } from "../../utils/ValidationError";
import { ApplyForGuideUseCase } from "../../application/usecase/user/ApplyForGuideUseCase";
import IUserInterface from "../../domain/interfaces/IUserController";
import { IGetUserProfile } from "../../application/usecase/user/interface/IGetUserProfileUseCase";
import { UserProfileDTO } from "../../application/dto/user/UserProfileDto";
import { IEditUserProfileUseCase } from "../../application/usecase/user/interface/IEditUserProfileUseCase";
import { IGetDestinationsUseCase } from "../../application/usecase/user/interface/IGetDestinationsUseCase";
import { IGetAllDestinations } from "../../application/usecase/admin/interface/IGetAllDestinations";
import { IGetGuidePaginatedUseCase } from "../../application/usecase/user/interface/IGetGuidesPaginatedusecase";
import { IGetSingleGuideUseCase } from "../../application/usecase/user/interface/IGetSingleGuideUseCase";
import { IGetAllPostGuideUseCase } from "../../application/usecase/user/interface/IGetAllPostGuideUseCase";
import { ILikeGuidePostUseCase } from "../../application/usecase/user/interface/ILikeGuidePostUseCase";
import { IUnLikeGuidePostUseCase } from "../../application/usecase/user/interface/IUnLikeGuidePostUseCase";
import { ICommentGuidePostUseCase } from "../../application/usecase/user/interface/ICommentGuidePostUseCase";
import { IReplyCommentGuidePostUseCase } from "../../application/usecase/user/interface/IReplyCommentGuidePostUseCase";
import { IFollowGuideUseCase } from "../../application/usecase/user/interface/IFollowGuideUseCase";
import { IUnfollowGuideUseCase } from "../../application/usecase/user/interface/IUnfollowGuideUseCase";
import { IGetGuideSinglePostUseCase } from "../../application/usecase/user/interface/IGetGuideSinglePostUseCase";
import { IHasAlreadyApplied } from "../../application/usecase/user/interface/IHasAlreadyApplied";
import { IBookGuideUseCase } from "../../application/usecase/user/interface/IBookGuideUseCase";
import { BookGuide } from "../../application/dto/user/IBookGuideData";
import { IFetchUserBookingsUseCase } from "../../application/usecase/user/interface/IFetchUserBookingsUseCase";
import { IFetchUserBookingDetailsUseCase } from "../../application/usecase/user/interface/IFetchUserBookingDetailsUseCase";
import { ICancelBookingUseCase } from "../../application/usecase/user/interface/ICancelBookingUseCase";
import { AddressDto } from "../../application/dto/user/requrest/AddressDto";
import { IAddAddressUseCase } from "../../application/usecase/user/interface/IAddAddressUseCase";

export default class UserController implements IUserInterface {
  constructor(
    private readonly _applyForGuideUseCase: ApplyForGuideUseCase,
    private readonly _guideProfileUseCase: IGetUserProfile,
    private readonly _editProfileUseCase: IEditUserProfileUseCase,
    private readonly _getSingleDestinationUseCase: IGetDestinationsUseCase,
    private readonly _getAllDestinationsUseCase: IGetAllDestinations,
    private readonly _getGuidespaginatedUseCase: IGetGuidePaginatedUseCase,
    private readonly _getSingleGuideUseCase: IGetSingleGuideUseCase,
    private readonly _getAllPostGuideUseCase: IGetAllPostGuideUseCase,
    private readonly _likeGUidePostUseCase: ILikeGuidePostUseCase,
    private readonly _unLikeGuidePostUseCase: IUnLikeGuidePostUseCase,
    private readonly _commentGuidePostUseCase: ICommentGuidePostUseCase,
    private readonly _replyCommentGuidePostUseCase: IReplyCommentGuidePostUseCase,
    private readonly _followGuideUseCase: IFollowGuideUseCase,
    private readonly _unfollowGuideUseCase: IUnfollowGuideUseCase,
    private readonly _getGuideSinglePostUseCase: IGetGuideSinglePostUseCase,
    private readonly _hasAlreadyAppliedUseCase: IHasAlreadyApplied,
    private readonly _bookGuideUseCase: IBookGuideUseCase,
    private readonly _fetchUserBookingsUseCase: IFetchUserBookingsUseCase,
    private readonly _fetchUserBookingDetailsUseCase: IFetchUserBookingDetailsUseCase,
    private readonly _cancelUserBookingUseCase: ICancelBookingUseCase,
    private readonly _addNewAddressUseCase : IAddAddressUseCase
  ) {}

  public getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;
      const user = await this._guideProfileUseCase.execute(userId);
      const userDTO = UserProfileDTO.formDomain(user);
      res.status(HttpStatusCode.OK).json(userDTO);
    } catch (error) {
      next(error);
    }
  };

  public hasRegistered = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId;
      const response = await this._hasAlreadyAppliedUseCase.execute(userId);
      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  public editProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updateData = req.body;
      const user = await this._editProfileUseCase.execute(updateData);
      const userData = UserProfileDTO.formDomain(user);
      res.status(HttpStatusCode.OK).json({ data: userData, message: "Profile updated successfully" });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(error.statusCode).json({
          status: "Validation Error",
          message: error.message,
        });
      } else {
        next(error);
      }
    }
  };

  public applyForGuide = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fullName, dob, phone, email, address, experience, expertise, userId, basedOn } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const idFile = files?.["idFile"]?.[0];
      const profilePhoto = files?.["profilePhoto"]?.[0];

      if (!idFile || !profilePhoto) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "ID proof and profile photo are required",
        });
        return;
      }

      const applicationDto = {
        fullName,
        dob: new Date(dob),
        phone,
        email,
        address,
        experience,
        expertise,
        idFileUrl: idFile.path,
        profilePhotoUrl: profilePhoto.path,
        userId,
        basedOn,
      };

      await this._applyForGuideUseCase.execute(applicationDto);

      res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: "Application submitted successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  public getDestinations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this._getAllDestinationsUseCase.findAll();
      res.status(HttpStatusCode.OK).json({ data });
    } catch (error) {
      next(error);
    }
  };

  public getSingleDestination = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = await this._getSingleDestinationUseCase.findById(id);
      res.status(HttpStatusCode.OK).json({ data });
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

  public getNewDestinations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = parseInt(req.params.limit as string) || 3;
      const data = await this._getAllDestinationsUseCase.findNew(limit);
      res.status(HttpStatusCode.OK).json({ data });
    } catch (error) {
      next(error);
    }
  };

  public getAllGuidesOnUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 9;
      const search = req.query.search?.toString() || "";
      const category = req.query.category?.toString() || "";

      const { data, total } = await this._getGuidespaginatedUseCase.execute(page, limit, search, category);
      res.status(HttpStatusCode.OK).json({
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

  public getGuideSingleData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.userId;
      const response = await this._getSingleGuideUseCase.execute(id);
      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getallPostGuideData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const response = await this._getAllPostGuideUseCase.execute(id);
      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getGuideSinglePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = req.params.postId;
      const response = await this._getGuideSinglePostUseCase.execute(postId);
      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  public likeGuidePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { postId, userId } = req.params;
      await this._likeGUidePostUseCase.execute(postId, userId);
      res.status(HttpStatusCode.CREATED).json({ success: true });
    } catch (error) {
      next(error);
    }
  };

  public unLikeGuidePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, postId } = req.params;
      await this._unLikeGuidePostUseCase.execute(postId, userId);
      res.status(HttpStatusCode.NO_CONTENT).json({ success: true });
    } catch (error) {
      next(error);
    }
  };

  public commentOnGuidePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const response = await this._commentGuidePostUseCase.execute(data);
      res.status(HttpStatusCode.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  };

  public replyCommentOnGuidePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const response = await this._replyCommentGuidePostUseCase.execute(data);
      res.status(HttpStatusCode.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  };

  public followGuide = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const guideId = req.params.guideId;
      const userId = req.params.userId;
      await this._followGuideUseCase.execute({ guideId, userId });
      res.status(HttpStatusCode.CREATED).json({ success: true });
    } catch (error) {
      next(error);
    }
  };

  public unfollowGuid = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const guideId = req.params.guideId;
      const userId = req.params.userId;
      await this._unfollowGuideUseCase.execute({ guideId, userId });
      res.status(HttpStatusCode.NO_CONTENT).json({ success: true });
    } catch (error) {
      next(error);
    }
  };

  public getGuideWDestinationController = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const destinationId = req.params.destinationId;
      const data = await this._getSingleDestinationUseCase.getGuideWDestination(destinationId);
      res.status(HttpStatusCode.OK).json(data);
    } catch (error) {
      next(error);
    }
  };

  public guideDataOnBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const guideId = req.params.guideId;
      const data = await this._getSingleGuideUseCase.execute(guideId);
      res.status(HttpStatusCode.OK).json(data);
    } catch (error) {
      next(error);
    }
  };

  public bookTheGuide = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const guideId = req.params.guideId;
      const userId = req.params.userId;
      const bookingdata: BookGuide = {
        guideId,
        userId,
        ...req.body,
      };
      const data = await this._bookGuideUseCase.execute(bookingdata);
      res.status(HttpStatusCode.CREATED).json(data);
    } catch (error) {
      next(error);
    }
  };

  public fetchUserBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId;
      const data = await this._fetchUserBookingsUseCase.execute(userId);
      res.status(HttpStatusCode.CREATED).json(data);
    } catch (error) {
      next(error);
    }
  };

  public fetchUserBookingDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookingId = req.params.bookingId;
      const data = await this._fetchUserBookingDetailsUseCase.execute(bookingId);
      res.status(HttpStatusCode.CREATED).json(data);
    } catch (error) {
      next(error);
    }
  };

  public cancelUserBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookingId = req.params.bookingId;
      const data = await this._cancelUserBookingUseCase.execute(bookingId);
      res.status(HttpStatusCode.CREATED).json(data);
    } catch (error) {
      next(error);
    }
  };

  public addNewAddress = async(req: Request, res: Response, next: NextFunction) => {
    try {
     const dto = new AddressDto(req.body);
     const response = await this._addNewAddressUseCase.execute(dto);
     res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getUserAddresses = async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId
    try {
      console.log(userId);
    } catch (error) {
      next(error);
    }
  };


}
