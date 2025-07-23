import { ICommentRepository } from "../../../infrastructure/database/repositories/interface/ICommentsRepository";
import { ILikeRepository } from "../../../infrastructure/database/repositories/interface/ILikeRepository";
import { IPostRepository } from "../../../infrastructure/database/repositories/interface/IPostsRepository";
import { CommentWithReplies, ISinglePostDetails, PopulatedComment, PopulatedLike } from "../../interfaces/IPostSummary";
import { IGetGuideSinglePostUseCase } from "./interface/IGetGuideSinglePostUseCase";



export class GetGuideSinglePostUseCase implements IGetGuideSinglePostUseCase {
    constructor(
        private postRepo: IPostRepository,
        private commentRepo: ICommentRepository,
        private likeRepo: ILikeRepository
    ) { };
    async execute(postId: string): Promise<ISinglePostDetails | null> {
        if (!postId) throw new Error("Post Id missing");

        const post = await this.postRepo.findById(postId);
        if (!post) throw new Error("Post not found");

        const commentsData = await this.commentRepo.findByPostId(postId);
        const likesData = await this.likeRepo.findByPostId(postId);

        const allComments: CommentWithReplies[] = (commentsData ?? []).map((comment) => {
            const populatedComment = comment as PopulatedComment;
            return {
                _id: populatedComment._id!,
                text: populatedComment.content,
                createdAt: populatedComment.createdAt,
                parentId: populatedComment.parentId ?? null,
                user: {
                    _id: populatedComment.user._id,
                    username: populatedComment.user.name,
                    profilePic: populatedComment.user.profilePic,
                },
                replies: [],
            };
        });

        const commentMap = new Map<string, CommentWithReplies>();
        const topLevelComments: CommentWithReplies[] = [];

        allComments.forEach((comment) => {
            commentMap.set(comment._id, comment);
        });

        allComments.forEach((comment) => {
            if (comment.parentId) {
                const parentComment = commentMap.get(comment.parentId.toString());
                if (parentComment) {
                    parentComment.replies.push(comment);
                }
            } else {
                topLevelComments.push(comment);
            }
        });

        // Step 2: Map likes
        const likes = (likesData ?? []).map((like) => {
            const populatedLike = like as PopulatedLike;
            return {
                _id: populatedLike.userId._id,
                username: populatedLike.userId.name,
                profilePic: populatedLike.userId.profilePic ?? "",
            };
        });

        return {
            _id: post._id!,
            caption: post.caption,
            photo: post.photos,
            createdAt: post.createdAt!,
            comments: topLevelComments,
            likes,
        };
    }
}