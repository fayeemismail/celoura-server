import { NextFunction, Request, Response } from "express";



export default interface IUserInterface {
    getProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    editProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    applyForGuide(req: Request, res: Response, next: NextFunction): Promise<void>;
};

