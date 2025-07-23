import { IFollowRepository } from "../../../infrastructure/database/repositories/interface/IFollowRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { FollowRequest } from "../../dto/user/FollowGuideDts";
import { IUnfollowGuideUseCase } from "./interface/IUnfollowGuideUseCase";



export class UnfollowGuideUseCase implements IUnfollowGuideUseCase{
    constructor(
        private userRepo: IUserRepository,
        private followRepo: IFollowRepository
    ) {};
    async execute(data: FollowRequest): Promise<void> {
        const { guideId, userId } = data;
        
        if(!guideId) throw new Error("Guide id missing");
        if(!userId) throw new Error("User Id missing");

        const user = this.userRepo.getUserById(userId);
        if(!user) throw new Error('User not found');

        const guide = this.userRepo.getGuideById(guideId);
        if(!guide) throw new Error("Guide not found");

        await this.followRepo.unfollowGuide(guideId, userId);
    }
}