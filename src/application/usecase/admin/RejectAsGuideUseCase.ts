import { IGuideApplicationRepository } from "../../../infrastructure/database/repositories/interface/IGuideApplicationRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IEmailService } from "../../interfaces/services/IEmailService";
import { IRejectAsGuide } from "./interface/IRejectAsGuide";


export class RejectAsGuideUseCase implements IRejectAsGuide {
    
    constructor(
        private readonly _userRepo: IUserRepository,
        private readonly _guideApplicationRepo: IGuideApplicationRepository,
        private readonly _emailService : IEmailService
    ) {}
    async execute(applicationId: string, userId: string, reason: string): Promise<void> {
        const application = await this._guideApplicationRepo.findApplication(applicationId);
        if(!application) throw new Error('Application Not found');
        
        const updatedUser = await this._userRepo.rejectAsGuide(userId);
        if(!updatedUser) throw new Error('User not found');

        await this._guideApplicationRepo.rejectGuideApplication(application._id, reason, userId);

        if(updatedUser.email) {
            await this._emailService.sendGuideRejectionEmail(updatedUser.email, reason)
        }
    }
}