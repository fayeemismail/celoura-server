import { GuideApplicationRepository } from "../../../infrastructure/database/repositories/GuideApplicationRepository";
import { IGuideApplicationRepository } from "../../../infrastructure/database/repositories/interface/IGuideApplicationRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IApproveAsGuide } from "./interface/IApproveAsGuide";



export class ApproveAsGuideUseCase implements IApproveAsGuide {
    constructor(
        private readonly _userRepo: IUserRepository,
        private readonly _guideRepo: IGuideApplicationRepository
    ){}
    async execute(applicationId: string, userId: string): Promise<any> {
        const application = await this._guideRepo.findApplication(applicationId);
        if(!application) throw new Error('Application NOT found');
        const updatedUser = await this._userRepo.approveAsGuide(userId);
        if(!updatedUser) throw new Error('User Not found');
        const approveApplication = await this._guideRepo.approveGuideApplication(application._id)
        if(!approveApplication) throw new Error('Approval failed');
    }
}