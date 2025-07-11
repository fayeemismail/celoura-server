import { Comments } from "../../../domain/entities/CommentEntity";
import CommentsModel from "../models/CommentsModel";
import guideModel from "../models/guideModel";
import userModel from "../models/userModel";
import { ICommentRepository } from "./interface/ICommentsRepository";




export class CommentsRepository implements ICommentRepository {
    async countByPostId(postId: string): Promise<number | null> {
        const allComments = await CommentsModel.countDocuments({postId: postId});
        return allComments;
    };

    async findByPostId(postId: string): Promise<any[]> {
        // Step 1: Fetch comments and populate user basic info
        const comments = await CommentsModel.find({ postId, parentId: null })
            .populate("userId", "name role") // we need role to check if user is a guide
            .lean();

        // Step 2: For users with role === 'guide', fetch their guide data
        const result = await Promise.all(
            comments.map(async (comment) => {
            const userId = comment.userId;
            const user = await userModel.findById(userId);
            if(!user) throw new Error('user not found')

            if (user.role === 'guide') {
                const guide = await guideModel.findOne({ user: user._id }).select("profilePic").lean();
                return {
                ...comment,
                user: {
                    _id: user._id,
                    name: user.name,
                    profilePic: guide?.profilePic || null
                }
                };
            } else {
                return {
                ...comment,
                user: {
                    _id: user._id,
                    name: user.name,
                    profilePic: null
                }
                };
            }
            })
        );

        return result;
    };

    async newComment(postId: string, userId: string, content: string): Promise<Comments | null> {
        const newComment = new CommentsModel({ postId, content, userId })
        return newComment.save();
    }
}