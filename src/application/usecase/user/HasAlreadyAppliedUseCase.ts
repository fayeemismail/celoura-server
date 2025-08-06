import { GuideApplication } from "../../../domain/entities/GuideApplication";
import { IGuideApplicationRepository } from "../../../infrastructure/database/repositories/interface/IGuideApplicationRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IHasAlreadyApplied } from "./interface/IHasAlreadyApplied";



export class HasAlreadyApplied implements IHasAlreadyApplied {
    constructor(
        private userRepo: IUserRepository,
        private guideRepo: IGuideApplicationRepository
    ) {};
    async execute(userId: string): Promise<GuideApplication | null> {
        if(!userId) throw new Error("User Id is missing");

        const user = await this.userRepo.getUserById(userId);
        if(!user) throw new Error("User not found");

        const guideApplication = await this.guideRepo.findUser(userId);
        if(!guideApplication) return null;

        return guideApplication
    }
}