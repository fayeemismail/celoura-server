import { GuideApplicationRepository } from "../../../infrastructure/database/repositories/GuideApplicationRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IRejectAsGuide } from "./interface/IRejectAsGuide";


export class RejectAsGuideUseCase implements IRejectAsGuide {
    private _guideRepo = new GuideApplicationRepository()
    constructor(
        private _userRepo: IUserRepository
    ) {}
    async execute(applicationId: string, userId: string): Promise<any> {
        const application = await this._guideRepo.findApplication(applicationId);
        if(!application) throw new Error('Application Not found');
        const updatedUser = await this._userRepo.rejectAsGuide(userId);
        if(!updatedUser) throw new Error('User not found');
        const rejectApplication = await this._guideRepo.rejectGuideApplication(application._id);
        if(!rejectApplication) throw new Error('Application Rejection failed');
    }
}