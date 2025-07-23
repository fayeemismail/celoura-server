import { FollowRequest } from "../../../dto/user/FollowGuideDts";



export interface IUnfollowGuideUseCase {
    execute(data: FollowRequest): Promise<void>;
}