// src/domain/interfaces/controllers/IAdminController.ts;
import { Request, Response } from "express";

export interface IAdminController {
    getAllUsers(req: Request, res: Response): Promise<void>;
    adminRefreshAccessToken(req: Request, res: Response): void;
    blockUser(req: Request, res: Response): Promise<void>;
    unBlockUser(req: Request, res: Response): Promise<void>;
    getGuideApplications(req: Request, res: Response): Promise<void>;
    approveGuide(req: Request, res: Response): Promise<void>;
};