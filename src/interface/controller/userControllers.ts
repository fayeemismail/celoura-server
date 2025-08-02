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




export default class UserController implements IUserInterface {
  constructor(
    private readonly _applyForGuideUseCase: ApplyForGuideUseCase,
    private readonly guideProfileUseCase: IGetUserProfile,
    private readonly editProfileUseCase: IEditUserProfileUseCase,
    private readonly getSingleDestinationUseCase: IGetDestinationsUseCase,
    private readonly getAllDestinationsUseCase: IGetAllDestinations,
    private readonly getGuidespaginatedUseCase: IGetGuidePaginatedUseCase,
    private readonly getSingleGuideUseCase: IGetSingleGuideUseCase,
    private readonly getAllPostGuideUseCase: IGetAllPostGuideUseCase,
    private readonly likeGUidePostUseCase: ILikeGuidePostUseCase,
    private readonly unLikeGuidePostUseCase: IUnLikeGuidePostUseCase,
    private readonly commentGuidePostUseCase: ICommentGuidePostUseCase,
    private readonly replyCommentGuidePostUseCase: IReplyCommentGuidePostUseCase,
    private readonly followGuideUseCase: IFollowGuideUseCase,
    private readonly unfollowGuideUseCase: IUnfollowGuideUseCase,
    private readonly getGuideSinglePostUseCase: IGetGuideSinglePostUseCase,
    private readonly hasAlreadyAppliedUseCase: IHasAlreadyApplied
  ) { }

  public getProfile = async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = req.params.id;
      const user = await this.guideProfileUseCase.execute(userId);
      const userDTO = UserProfileDTO.formDomain(user);

      res.status(HttpStatusCode.OK).json(userDTO);
    } catch (error: unknown) {
      const message = extractErrorMessage(error)
      console.error('Get Profile Error: ', message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: message })
    }
  };

  public hasRegistered = async(req: Request, res: Response) => {
    const userId = req.params.userId
    try {
      const response = await this.hasAlreadyAppliedUseCase.execute(userId);
      res.status(HttpStatusCode.OK).json(response)
    } catch (error) {
      console.log(error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Some thing went wrong on fetch application" });
    }
  }

  public editProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const updateData = req.body;
      const user = await this.editProfileUseCase.execute(updateData);

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

  public applyForGuide = async (req: Request, res: Response): Promise<any> => {
    try {
      const { fullName, dob, phone, email, address, experience, expertise, userId, basedOn } = req.body;
      const idFileUrl = req.file?.path;

      if (!idFileUrl) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: 'Identity proof file is required' });
      }

      const application = { fullName, dob, phone, email, address, experience, expertise, idFileUrl, userId, basedOn };
      await this._applyForGuideUseCase.execute(application)
      return res.status(HttpStatusCode.CREATED).json({ success: true, message: 'Application submited SuccessFully' })
    } catch (error: unknown) {
      const message = extractErrorMessage(error)
      console.log('Error', message);
      res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: message })
    }
  }

  public getDestinations = async (req: Request, res: Response) => {
    try {
      const data = await this.getAllDestinationsUseCase.findAll();
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
      const data = await this.getSingleDestinationUseCase.findById(id);
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
    } catch (error: unknown) {
      const message = extractErrorMessage(error)
      console.error("GetAllDestinations Error:", error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: message || "Internal Server Error" });
    }
  }

  public getNewDestinations = async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.params.limit as string) || 3;

      const data = await this.getAllDestinationsUseCase.findNew(limit);
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
    console.log(category, 'this is category>>>>>>>>>>>>>>>>')
    console.log(search, 'this is search')
    try {
      const { data, total } = await this.getGuidespaginatedUseCase.execute(page, limit, search, category);
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
      const response = await this.getSingleGuideUseCase.execute(id);
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
      const response = await this.getAllPostGuideUseCase.execute(id);
      res.status(HttpStatusCode.OK).json(response)
    } catch (error) {
      console.log('Erro on Fetching Post', error);
      res.status(HttpStatusCode.OK).json({ message: "Something went wrong on Fetching posts" });
    }
  };

  public getGuideSinglePost = async(req: Request, res: Response) => {
    const postId = req.params.postId;
    try {
      const response = await this.getGuideSinglePostUseCase.execute(postId);
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
      await this.likeGUidePostUseCase.execute(postId, userId);
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
      await this.unLikeGuidePostUseCase.execute(postId, userId);
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
      const response = await this.commentGuidePostUseCase.execute(data);
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
      const response = await this.replyCommentGuidePostUseCase.execute(data);
      res.status(HttpStatusCode.CREATED).json(response);
    } catch (error) {
      const message = extractErrorMessage(error);
      console.log(error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message:"Something went wrong on Reply" })
    }
  };

  public followGuide = async(req: Request, res: Response) => {
    const guideId = req.params.guideId;
    const userId = req.params.userId;
    try {
      await this.followGuideUseCase.execute({guideId, userId});
      res.status(HttpStatusCode.CREATED).json({ success: true });
    } catch (error) {
      console.log(error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong on follow" });
    }
  };

  public unfollowGuid = async(req: Request, res: Response) => {
    const guideId = req.params.guideId;
    const userId = req.params.userId;
    try {
      await this.unfollowGuideUseCase.execute({ guideId, userId });
      res.status(HttpStatusCode.NO_CONTENT).json({ success: true })
    } catch (error) {
      console.log(error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong on unfollow" });
    }
  }
};