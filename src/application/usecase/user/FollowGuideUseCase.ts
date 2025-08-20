import { IFollowRepository } from "../../../infrastructure/database/repositories/interface/IFollowRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { FollowRequest } from "../../dto/user/FollowGuideDts";
import { IFollowGuideUseCase } from "./interface/IFollowGuideUseCase";



export class FollowGuideUseCase implements IFollowGuideUseCase {
    constructor(
        private _userRepo: IUserRepository,
        private _followRepo: IFollowRepository
    ) {};
    async execute(data: FollowRequest): Promise<void> {
        const { guideId, userId } = data;

        if(!guideId) throw new Error("Guide Id missing");
        if(!userId) throw new Error("User Id Missing");
        if(userId == guideId) throw new Error("Cannot follow them selves");

        const user = await this._userRepo.getUserById(userId);
        if(!user) throw new Error("User not found");

        const guide = await this._userRepo.getGuideById(guideId);
        if(!guide) throw new Error('Guide not found');

        await this._followRepo.followGuide(guideId, userId)
    }
}