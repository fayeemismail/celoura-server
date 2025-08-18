import { IGuideApplicationRepository } from "../../../infrastructure/database/repositories/interface/IGuideApplicationRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IApproveAsGuide } from "./interface/IApproveAsGuide";
import guideModel from "../../../infrastructure/database/models/guideModel";
import { IGetGuideRepository } from "../../../infrastructure/database/repositories/interface/IGuideRepository";


export class ApproveAsGuideUseCase implements IApproveAsGuide {
    constructor(
        private readonly _userRepo: IUserRepository,
        private readonly _guideApplicationRepo: IGuideApplicationRepository,
        private readonly _guideRepo: IGetGuideRepository
    ) { }
    async execute(applicationId: string, userId: string): Promise<void> {
        const application = await this._guideApplicationRepo.findApplication(applicationId);
        if (!application) throw new Error('Application NOT found');

        const updatedUser = await this._userRepo.approveAsGuide(userId);
        if (!updatedUser) throw new Error('User Not found');

        const approveApplication = await this._guideApplicationRepo.approveGuideApplication(application._id);
        if (!approveApplication) throw new Error('Approval failed');

        const existingGuide = await guideModel.findOne({ user: userId });

        if (existingGuide) {
            await this._userRepo.reApproveAsGuide(userId);
            await this._guideRepo.unBlockGuide(userId);
            return;
        }

        let saved = await guideModel.create({
            user: userId,
            destinations: [],
            happyCustomers: [],
            followers: [],
            posts: [],
            bio: "",
            profilePic: "",
            blocked: false,
            expertise: [approveApplication.expertise],
            basedOn: approveApplication.basedOn,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        if (!saved) {
            throw new Error("something went wrong");
        }
    }
}