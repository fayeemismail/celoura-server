import mongoose, { Schema } from "mongoose";
import { Follows } from "../../../domain/entities/FollowFollowingEntity";


const followSchema: Schema<Follows> = new Schema({
    userId: { type: String, ref: 'User', required: true },
    guideId: { type: String, ref: "user", required: true },
    followedAt: { type: Date }
});

export default mongoose.model("Follows", followSchema);