import { Request, Response } from "express";
import { UserRepository } from "../../infrastructure/database/repositories/UserRepository";
import { getUserProfile } from "../../application/usecase/user/getUserProfile";
import { HttpStatusCode } from "../../application/constants/httpStatus";
import { editProfile } from "../../application/usecase/user/editProfile";
import { ValidationError } from "../../utils/ValidationError";
import { ApplyForGuideUseCase } from "../../application/usecase/user/ApplyForGuideUseCase";
import IUserInterface from "../../domain/interfaces/IUserController";
import { GetDestinationsUseCase } from "../../application/usecase/user/GetDestinationsUseCase";
import { GetAllDestinationsUseCase } from "../../application/usecase/admin/GetAllDestinationsUseCase";




export default class UserController implements IUserInterface {
  private _userRepo: UserRepository;
  constructor(
    private _applyForGuideUseCase: ApplyForGuideUseCase
  ) {
    this._userRepo = new UserRepository();
  }

  public getProfile = async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = req.params.id;
      const user = await getUserProfile(userId, this._userRepo);

      res.status(HttpStatusCode.OK).json(user);
    } catch (error: any) {
      console.error('Get Profile Error: ', error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: error.message })
    }
  }

  public editProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const updateData = req.body;
      const updatedUser = await editProfile(updateData, this._userRepo);

      res.status(HttpStatusCode.OK).json({ message: 'Profile pdated successfully' });
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

      const application = {
        fullName,
        dob,
        phone,
        email,
        address,
        experience,
        expertise,
        idFileUrl,
        userId
      };
      const result = await this._applyForGuideUseCase.execute(application)
      return res.status(HttpStatusCode.CREATED).json({ success: true, message: 'Application submited SuccessFully' })
    } catch (error: any) {
      console.log('Error', error.message);
      res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: error.message })
    }
  }

  public getDestinations = async (req: Request, res: Response) => {
    try {
      const destinationUseCase = new GetDestinationsUseCase();
      const data = await destinationUseCase.findAll();
      res.status(HttpStatusCode.OK).json({ data })
    } catch (error: any) {
      console.log(error.message)
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message || "Unexpected error on fetching data" })
    }
  }

  public getSingleDestination = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const destinationUseCase = new GetDestinationsUseCase();
      const data = await destinationUseCase.findById(id);
      res.status(HttpStatusCode.OK).json({ data })
    } catch (error: any) {
      console.log(error.message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Cannot get destination"
      })
    }
  }

  public getPaginatedDestinations = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 9;
      const search = req.query.search?.toString() || "";
      const attraction = req.query.attraction?.toString() || "";

      const _destinationsUseCase = new GetAllDestinationsUseCase();
      const { data, total } = await _destinationsUseCase.execute(page, limit, search, attraction);

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
  }

  public getNewDestinations = async(req: Request, res: Response) => {
    try {
      const limit = parseInt(req.params.limit as string) || 3;
      const destinationUseCase = new GetAllDestinationsUseCase();
      const data = await destinationUseCase.findNew(limit);
      res.status(HttpStatusCode.OK).json({data})
    } catch (error: any) {
      console.log(error.message);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message || "Something went wrong" });
    }
  }

};