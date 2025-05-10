import { Request, Response } from "express";
import { GetAllUserUseCase } from "../../application/usecase/admin/GetAllUserUseCase";
import { HTTP_STATUS } from "../../application/constants/httpStatus";




export default class AdminContrller {
    constructor( private getAllUserUseCase: GetAllUserUseCase ) {};

    public getAllUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await this.getAllUserUseCase.execute();
            res.status(HTTP_STATUS.OK.code).json({ status: true, data: users });
        } catch (error: unknown) {
            
        }
    }

}