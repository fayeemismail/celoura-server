import { Request, Response, NextFunction } from "express";

export default interface IAuthController {
    signup(req: Request, res: Response, next: NextFunction): Promise<any>;
    login(req: Request, res: Response): Promise<any>;
    logoutUser(req: Request, res: Response): void;
    adminLogin(req: Request, res: Response): Promise<any>;
    adminLogout(req: Request, res: Response): void;
    refreshAccessToken(req: Request, res: Response): any;
    verifyOtp(req: Request, res: Response): Promise<any>;
    resendOtp(req: Request, res: Response): Promise<any>;
    getCurrentUser(req: Request, res: Response): Promise<any>;
}
