import { Request, Response } from "express";



export default interface IUserInterface {
    getProfile(req: Request, res: Response): Promise<any>;
    editProfile(req: Request, res: Response): Promise<any>;
    applyForGuide(req: Request, res: Response): Promise<any>;
};

