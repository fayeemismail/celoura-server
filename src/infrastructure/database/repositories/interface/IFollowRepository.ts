import { FollowRequest } from "../../../../application/dto/user/FollowGuideDts";



export interface IFollowRepository {
    followGuide(guideId: string, userId: string): Promise<void>;
    unfollowGuide(guideId: string, userId: string): Promise<void>;
}