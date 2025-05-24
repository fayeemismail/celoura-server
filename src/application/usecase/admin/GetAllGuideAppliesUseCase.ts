import { GuideApplication } from "../../../domain/entities/GuideApplication";
import { GuideApplicationRepository } from "../../../infrastructure/database/repositories/GuideApplicationRepository";
import { IGuideApplicationRepository } from "../../../infrastructure/database/repositories/interface/IGuideApplicationRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IGetAllGuideApplies } from "./interface/IGetAllGuideApplies";



export class GetAllGuideAppliesUseCase implements IGetAllGuideApplies {
    private _guideRepo = new GuideApplicationRepository()
    constructor(){}
    async execute(): Promise<GuideApplication[]> {
        return await this._guideRepo.findAll();
    }
};