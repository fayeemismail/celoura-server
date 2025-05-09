import { Request, Response } from "express";
import IUserInterface from "../../domain/interfaces/IUserController";
import { UserRepository } from "../../infrastructure/database/repositories/UserRepository";
import { getUserProfile } from "../../application/usecase/user/getUserProfile";
import { HTTP_STATUS } from "../../application/constants/httpStatus";
import { editProfile } from "../../application/usecase/user/editProfile";
import { ValidationError } from "../../utils/ValidationError";




export default class UserController implements IUserInterface {
    private _userRepo: UserRepository;
    constructor() {
        this._userRepo = new UserRepository(); 
    }

    public getProfile = async(req: Request, res: Response): Promise<any> => {
        try {
            const userId = req.params.id 
            const user = await getUserProfile(userId, this._userRepo);

            res.status(200).json(user)
        } catch (error: any) {
            console.error('Get Profile Error: ', error);
            res.status(400).json({ error: error.message })
        }
    }

    public editProfile = async(req: Request, res: Response): Promise<void> => {
        try {
            const updateData = req.body;

            const updatedUser = await editProfile( updateData, this._userRepo)
            console.log(updatedUser, 'this is updating data')

            res.status(HTTP_STATUS.OK.code).json({message: 'Profile pdated successfully'});
        } catch (error: unknown) {
            if (error instanceof ValidationError) {
                res.status(error.statusCode).json({
                  status: "Validation Error",
                  error: error.message,
                });
              } else if (error instanceof Error) {
                console.error(error.message);
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code).json({
                  status: HTTP_STATUS.INTERNAL_SERVER_ERROR.message,
                  error: error.message,
                });
              } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code).json({
                  status: HTTP_STATUS.INTERNAL_SERVER_ERROR.message,
                  error: "Unexpected error occurred",
                });
              }
        }
    }

};