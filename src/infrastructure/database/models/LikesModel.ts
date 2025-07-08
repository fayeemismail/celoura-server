import mongoose, { Schema, Types } from "mongoose";
import { Likes } from "../../../domain/entities/LikeEntitiy";



const LikesSchema: Schema <Likes> = new Schema(
    {
        postId: { type: String, ref: "Posts" ,required: true },
        userId: { type: String, ref: "User" ,required: true },

    }, {
        timestamps: true
    }
);

LikesSchema.index({ postId: 1, userId: 1 }, { unique: true });

export default mongoose.model("Likes", LikesSchema);