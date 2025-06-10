import { GuideApplication } from "../../../domain/entities/GuideApplication";
import { GuideApplicationRepository } from "../../../infrastructure/database/repositories/GuideApplicationRepository";
import { IGuideApplicationRepository } from "../../../infrastructure/database/repositories/interface/IGuideApplicationRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IGetAllGuideApplies } from "./interface/IGetAllGuideApplies";



export class GetAllGuideAppliesUseCase implements IGetAllGuideApplies {
    private _guideRepo = new GuideApplicationRepository()
    constructor(){}
    async execute(page: number, limit: number): Promise<{ data: GuideApplication[], total: number, totalPages: number }> {
    return await this._guideRepo.findPaginated(page, limit);
  }
};