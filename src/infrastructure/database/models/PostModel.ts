import mongoose, { Schema } from "mongoose";
import { Posts } from "../../../domain/entities/PostEntity";




const postSchema: Schema < Posts > = new Schema(
    {
        guideId: { type: String, ref: "User", required: true },
        caption: { type: String },
        photos: [{ type: String }],
        comments: { type: Boolean, default: true }
    }, {
        timestamps: true
    }
);

export default mongoose.model('Posts', postSchema);