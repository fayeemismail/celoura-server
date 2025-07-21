import { IGuideApplicationRepository } from "../../../infrastructure/database/repositories/interface/IGuideApplicationRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IApproveAsGuide } from "./interface/IApproveAsGuide";
import guideModel from "../../../infrastructure/database/models/guideModel";


export class ApproveAsGuideUseCase implements IApproveAsGuide {
    constructor(
        private readonly _userRepo: IUserRepository,
        private readonly _guideRepo: IGuideApplicationRepository
    ){}
    async execute(applicationId: string, userId: string): Promise<void> {
        //finding if there is any duplicates in or not
        const application = await this._guideRepo.findApplication(applicationId);
        if(!application) throw new Error('Application NOT found');
        
        //approving as guide
        const updatedUser = await this._userRepo.approveAsGuide(userId);
        if(!updatedUser) throw new Error('User Not found');

        //approving the guide application
        const approveApplication = await this._guideRepo.approveGuideApplication(application._id);
        if(!approveApplication) throw new Error('Approval failed');

        //finding is the guide already in the guidemodel
        const existingGuide = await guideModel.findOne({ user: userId });
        if(existingGuide) throw new Error("Guide already exists");

        await guideModel.create({
            user: userId,
            destinations: [],
            happyCustomers: [],
            followers: [],
            posts: [],
            bio: "",
            profilePic: "",
            basedOn: approveApplication.basedOn,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }
}