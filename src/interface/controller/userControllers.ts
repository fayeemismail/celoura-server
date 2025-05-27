import { Request, Response } from "express";
import IUserInterface from "../../domain/interfaces/controller/IUserController";
import { UserRepository } from "../../infrastructure/database/repositories/UserRepository";
import { getUserProfile } from "../../application/usecase/user/getUserProfile";
import { HttpStatusCode } from "../../application/constants/httpStatus";
import { editProfile } from "../../application/usecase/user/editProfile";
import { ValidationError } from "../../utils/ValidationError";
import { ApplyForGuideUseCase } from "../../application/usecase/user/ApplyForGuideUseCase";




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

  public applyForGuide = async(req: Request, res: Response): Promise<any> =>  {
    try {
      const { fullName, dob, phone, email, address,  experience, expertise, userId } = req.body;
      const idFileUrl = req.file?.path;

      if(!idFileUrl) {
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
    return res.status(HttpStatusCode.CREATED).json({success: true, message: 'Application submited SuccessFully'})
    } catch (error: any) {
      console.log('Error', error.message);
      res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: error.message })
    }
  }

};