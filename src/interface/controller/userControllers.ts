import { Request, Response } from "express";
import { HttpStatusCode } from "../../application/constants/httpStatus";
import { ValidationError } from "../../utils/ValidationError";
import { ApplyForGuideUseCase } from "../../application/usecase/user/ApplyForGuideUseCase";
import IUserInterface from "../../domain/interfaces/IUserController";
import { IGetUserProfile } from "../../application/usecase/user/interface/IGetUserProfileUseCase";
import { UserProfileDTO } from "../../application/dto/user/UserProfileDto";
import { IEditUserProfileUseCase } from "../../application/usecase/user/interface/IEditUserProfileUseCase";
import { IGetDestinationsUseCase } from "../../application/usecase/user/interface/IGetDestinationsUseCase";
import { IGetAllDestinations } from "../../application/usecase/admin/interface/IGetAllDestinations";
import { extractErrorMessage } from "../../utils/errorHelpers";
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
    private readonly _cancelUserBookingUseCase: ICancelBookingUseCase
  ) { }

  public getProfile = async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = req.params.id;
      const user = await this._guideProfileUseCase.execute(userId);
      const userDTO = UserProfileDTO.formDomain(user);

      res.status(HttpStatusCode.OK).json(userDTO);
    } catch (error: unknown) {
      const message = extractErrorMessage(error)
      console.error('Get Profile Error: ', message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: message })
    }
  };

  public hasRegistered = async (req: Request, res: Response) => {
    const userId = req.params.userId
    try {
      const response = await this._hasAlreadyAppliedUseCase.execute(userId);
      res.status(HttpStatusCode.OK).json(response)
    } catch (error) {
      console.log(error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Some thing went wrong on fetch application" });
    }
  }

  public editProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const updateData = req.body;
      const user = await this._editProfileUseCase.execute(updateData);

      const userData = UserProfileDTO.formDomain(user);

      res.status(HttpStatusCode.OK).json({ data: userData, message: 'Profile pdated successfully' });
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        res.status(error.statusCode).json({
          status: "Validation Error",
          message: error.message,
        });
      } else if (error instanceof Error) {
        console.error(error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
          status: HttpStatusCode.INTERNAL_SERVER_ERROR,
          message: error.message,
        });
      } else {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
          status: HttpStatusCode.INTERNAL_SERVER_ERROR,
          message: "Unexpected error occurred",
        });
      }
    }
  }

  public applyForGuide = async (req: Request, res: Response): Promise<void> => {
    try {
      const { fullName, dob, phone, email, address, experience, expertise, userId, basedOn } = req.body;

      // Cast req.files into a dictionary type
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const idFile = files?.["idFile"]?.[0];
      const profilePhoto = files?.["profilePhoto"]?.[0];

      if (!idFile) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Identity proof file is required",
        });
        return;
      }

      if (!profilePhoto) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Profile photo is required",
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
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      console.log("Error", message);
      res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message,
      });
    }
  }

  public getDestinations = async (req: Request, res: Response) => {
    try {
      const data = await this._getAllDestinationsUseCase.findAll();
      res.status(HttpStatusCode.OK).json({ data })
    } catch (error: unknown) {
      const message = extractErrorMessage(error)
      console.log(message)
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: message || "Unexpected error on fetching data" })
    }
  }

  public getSingleDestination = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await this._getSingleDestinationUseCase.findById(id);
      res.status(HttpStatusCode.OK).json({ data })
    } catch (error: unknown) {
      const message = extractErrorMessage(error)
      console.log(message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: message || "Cannot get destination"
      })
    }
  }

  public getPaginatedDestinations = async (req: Request, res: Response) => {
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
    } catch (error: unknown) {
      const message = extractErrorMessage(error)
      console.error("GetAllDestinations Error:", error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: message || "Internal Server Error" });
    }
  }

  public getNewDestinations = async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.params.limit as string) || 3;

      const data = await this._getAllDestinationsUseCase.findNew(limit);
      res.status(HttpStatusCode.OK).json({ data })
    } catch (error: unknown) {
      const message = extractErrorMessage(error)
      console.log(error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: message || "Something went wrong" });
    }
  };

  public getAllGuidesOnUser = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 9;
    const search = req.query.search?.toString() || "";
    const category = req.query.category?.toString() || "";
    try {
      const { data, total } = await this._getGuidespaginatedUseCase.execute(page, limit, search, category);
      res.status(HttpStatusCode.OK).json({
        data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      })
    } catch (error) {
      const message = extractErrorMessage(error);
      console.log(error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: message || "Cannot Fetch Guides" });
    }
  };

  public getGuideSingleData = async (req: Request, res: Response) => {
    const id = req.params.userId
    try {
      const response = await this._getSingleGuideUseCase.execute(id);
      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      const message = extractErrorMessage(error)
      console.log("this is message ", message ?? "Error On Getting Single Guide", error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: message ?? 'Some thing went Wrong on Getting Data' });
    }
  };

  public getallPostGuideData = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const response = await this._getAllPostGuideUseCase.execute(id);
      res.status(HttpStatusCode.OK).json(response)
    } catch (error) {
      console.log('Erro on Fetching Post', error);
      res.status(HttpStatusCode.OK).json({ message: "Something went wrong on Fetching posts" });
    }
  };

  public getGuideSinglePost = async (req: Request, res: Response) => {
    const postId = req.params.postId;
    try {
      const response = await this._getGuideSinglePostUseCase.execute(postId);
      res.status(HttpStatusCode.OK).json(response)
    } catch (error) {
      const message = extractErrorMessage(error);
      console.log(error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong on fetching post" });
    }
  }

  public likeGuidePost = async (req: Request, res: Response) => {
    const { postId, userId } = req.params
    try {
      await this._likeGUidePostUseCase.execute(postId, userId);
      res.status(HttpStatusCode.CREATED).json({ success: true });
    } catch (error) {
      const message = extractErrorMessage(error);
      console.log(error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: message ?? "Something went wrong on liking" })
    }
  };

  public unLikeGuidePost = async (req: Request, res: Response) => {
    const { userId, postId } = req.params
    try {
      await this._unLikeGuidePostUseCase.execute(postId, userId);
      res.status(HttpStatusCode.NO_CONTENT).json({ success: true })
    } catch (error) {
      const message = extractErrorMessage(error);
      console.log(error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: message ?? "Something went wrong on unLiking" })
    }
  };

  public commentOnGuidePost = async (req: Request, res: Response) => {
    const data = req.body;
    try {
      const response = await this._commentGuidePostUseCase.execute(data);
      res.status(HttpStatusCode.CREATED).json(response);
    } catch (error) {
      const message = extractErrorMessage(error);
      console.log(error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: message ?? "Something went wrong on Commenting" })
    }
  }
  public replyCommentOnGuidePost = async (req: Request, res: Response) => {
    const data = req.body;
    try {
      const response = await this._replyCommentGuidePostUseCase.execute(data);
      res.status(HttpStatusCode.CREATED).json(response);
    } catch (error) {
      const message = extractErrorMessage(error);
      console.log(error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong on Reply" })
    }
  };

  public followGuide = async (req: Request, res: Response) => {
    const guideId = req.params.guideId;
    const userId = req.params.userId;
    try {
      await this._followGuideUseCase.execute({ guideId, userId });
      res.status(HttpStatusCode.CREATED).json({ success: true });
    } catch (error) {
      console.log(error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong on follow" });
    }
  };

  public unfollowGuid = async (req: Request, res: Response) => {
    const guideId = req.params.guideId;
    const userId = req.params.userId;
    try {
      await this._unfollowGuideUseCase.execute({ guideId, userId });
      res.status(HttpStatusCode.NO_CONTENT).json({ success: true })
    } catch (error) {
      console.log(error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong on unfollow" });
    }
  };

  public getGuideWDestinationController = async (req: Request, res: Response) => {
    const destinationId = req.params.destinationId;
    try {
      const data = await this._getSingleDestinationUseCase.getGuideWDestination(destinationId);
      res.status(HttpStatusCode.OK).json(data);
    } catch (error) {
      console.log(error, "Cannot find the destination or guide");
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Cannot find the destination or guide" })
    }
  };

  public guideDataOnBooking = async (req: Request, res: Response) => {
    const guideId = req.params.guideId;
    try {
      const data = await this._getSingleGuideUseCase.execute(guideId);
      res.status(HttpStatusCode.OK).json(data)
    } catch (error) {
      console.log(error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Cannot get Guide Data" })
    }
  }

  public bookTheGuide = async (req: Request, res: Response) => {
    const guideId = req.params.guideId;
    const userId = req.params.userId;
    const destinationId = req.params.destinationId;
    try {
      const bookingdata: BookGuide = {
        guideId,
        userId,
        ...req.body
      }
      const data = await this._bookGuideUseCase.execute(bookingdata)
      res.status(HttpStatusCode.CREATED).json(data)
    } catch (error) {
      const message = extractErrorMessage(error)
      console.log(message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(message)
    }
  };

  public fetchUserBookings = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    try {
      const data = await this._fetchUserBookingsUseCase.execute(userId);
      res.status(HttpStatusCode.CREATED).json(data)
    } catch (error) {
      const message = extractErrorMessage(error)
      console.log(message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(message)
    }
  };

  public fetchUserBookingDetails = async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId;
    try {
      console.log(bookingId)
      const data = await this._fetchUserBookingDetailsUseCase.execute(bookingId)
      res.status(HttpStatusCode.CREATED).json(data)
    } catch (error) {
      const message = extractErrorMessage(error)
      console.log(message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(message)
    }
  };

  public cancelUserBooking = async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId;
    try {
      const data = await this._cancelUserBookingUseCase.execute(bookingId)
      res.status(HttpStatusCode.CREATED).json(data)
    } catch (error) {
      const message = extractErrorMessage(error)
      console.log(message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(message)
    }
  };

};