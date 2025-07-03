import { Request, Response, NextFunction } from "express";

export default interface IAuthController {
    signup(req: Request, res: Response, next: NextFunction): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    logoutUser(req: Request, res: Response): void;
    adminLogin(req: Request, res: Response): Promise<void>;
    adminLogout(req: Request, res: Response): void;
    refreshAccessToken(req: Request, res: Response): Promise<void>;
    verifyOtp(req: Request, res: Response): Promise<void>;
    resendOtp(req: Request, res: Response): Promise<void>;
    getCurrentUser(req: Request, res: Response): Promise<void>;
    googleLoginVerify(req: Request, res: Response): Promise<void>
}
