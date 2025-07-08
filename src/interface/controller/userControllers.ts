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




export default class UserController implements IUserInterface {
  constructor(
    private readonly _applyForGuideUseCase: ApplyForGuideUseCase,
    private readonly guideProfileUseCase : IGetUserProfile,
    private readonly editProfileUseCase : IEditUserProfileUseCase,
    private readonly getSingleDestinationUseCase : IGetDestinationsUseCase,
    private readonly getAllDestinationsUseCase : IGetAllDestinations
  ) {}

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
  }

  public editProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const updateData = req.body;
      const user = await this.editProfileUseCase.execute(updateData);

      const userData =  UserProfileDTO.formDomain(user);

      res.status(HttpStatusCode.OK).json({ data: userData,  message: 'Profile pdated successfully' });
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
      const { fullName, dob, phone, email, address, experience, expertise, userId } = req.body;
      const idFileUrl = req.file?.path;

      if (!idFileUrl) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: 'Identity proof file is required' });
      }

      const application = { fullName, dob, phone, email, address, experience, expertise, idFileUrl, userId };
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

  public getNewDestinations = async(req: Request, res: Response) => {
    try {
      const limit = parseInt(req.params.limit as string) || 3;
      
      const data = await this.getAllDestinationsUseCase.findNew(limit);
      res.status(HttpStatusCode.OK).json({data})
    } catch (error: unknown) {
      const message = extractErrorMessage(error)
      console.log(error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: message || "Something went wrong" });
    }
  }

};