import { GuideApplicationRepository } from "../../../infrastructure/database/repositories/GuideApplicationRepository";
import { IGuideApplicationRepository } from "../../../infrastructure/database/repositories/interface/IGuideApplicationRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IApproveAsGuide } from "./interface/IApproveAsGuide";



export class ApproveAsGuideUseCase implements IApproveAsGuide {
    private _guideRepo = new GuideApplicationRepository()
    constructor(
        private _userRepo: IUserRepository
    ){}
    async execute(applicationId: string, userId: string): Promise<any> {
        const application = this._guideRepo.findApplication(applicationId);
        if(!application) throw new Error('Application NOT found');
        const updatedUser = await this._userRepo.approveAsGuide(userId);
        if(!updatedUser) throw new Error('User Not found');
    }
}