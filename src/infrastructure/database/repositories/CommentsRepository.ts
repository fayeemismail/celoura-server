import { Comments } from "../../../domain/entities/CommentEntity";
import CommentsModel from "../models/CommentsModel";
import { ICommentRepository } from "./interface/ICommentsRepository";




export class CommentsRepository implements ICommentRepository {
    async countByPostId(postId: string): Promise<number | null> {
        const allComments = await CommentsModel.countDocuments({postId: postId});
        return allComments;
    };

    async findByPostId(postId: string): Promise<Comments[] | null> {
        const comments = await CommentsModel.find(({ postId, parentId: null }))
        .populate("userId", "name profilePic")
        .lean();
        return comments
    }
}