import { ObjectId } from "mongoose";


export interface Follows {
    userId: ObjectId;
    guideId: ObjectId;
    followedAt: Date;
}