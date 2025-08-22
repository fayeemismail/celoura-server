import { Request, Response } from "express";



export default interface IUserInterface {
    getProfile(req: Request, res: Response): Promise<void>;
    editProfile(req: Request, res: Response): Promise<void>;
    applyForGuide(req: Request, res: Response): Promise<void>;
};

