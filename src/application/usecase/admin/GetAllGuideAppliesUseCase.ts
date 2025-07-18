import { GuideApplication } from "../../../domain/entities/GuideApplication";
import { IGuideApplicationRepository } from "../../../infrastructure/database/repositories/interface/IGuideApplicationRepository";
import { IGetAllGuideApplies } from "./interface/IGetAllGuideApplies";



export class GetAllGuideAppliesUseCase implements IGetAllGuideApplies {
    constructor(
      private readonly _guideRepo: IGuideApplicationRepository
    ){}
    async execute(page: number, limit: number): Promise<{ data: GuideApplication[], total: number, totalPages: number }> {
    return await this._guideRepo.findPaginated(page, limit);
  }
};