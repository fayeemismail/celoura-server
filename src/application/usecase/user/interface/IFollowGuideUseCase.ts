import { FollowRequest } from "../../../dto/user/FollowGuideDts";



export interface IFollowGuideUseCase {
    execute(data: FollowRequest): Promise<void>;
}