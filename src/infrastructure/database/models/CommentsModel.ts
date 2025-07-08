import mongoose, { Schema } from "mongoose";
import { Comments } from "../../../domain/entities/CommentEntity";




const CommentsSchema: Schema <Comments> = new Schema({
    postId: { type: String, ref: "Posts", required: true },
    userId: { type: String, ref: "User", required: true },
    content: { type: String, required: true },
    parentId: { type: Schema.Types.ObjectId, ref: "Comments", default: null },
}, {
    timestamps: true
});

export default mongoose.model("Comments", CommentsSchema)