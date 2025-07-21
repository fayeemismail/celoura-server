import { ICommentRepository } from "../../../infrastructure/database/repositories/interface/ICommentsRepository";
import { IPostRepository } from "../../../infrastructure/database/repositories/interface/IPostsRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { AddReplyCommentOnGuidePost, newCommentToSent } from "../../dto/user/ICommentResponse";
import { IReplyCommentGuidePostUseCase } from "./interface/IReplyCommentGuidePostUseCase";



export class ReplyCommentGuidePostuseCase implements IReplyCommentGuidePostUseCase {
    constructor(
        private postRepo: IPostRepository,
        private commentRepo: ICommentRepository,
        private userRepo: IUserRepository
    ) { };
    async execute(data: AddReplyCommentOnGuidePost): Promise<newCommentToSent> {
        const { postId, content, userId, parentId } = data;

        if (!postId || !content || !userId || !parentId) {
            throw new Error('Fields are missing');
        };
        const post = await this.postRepo.findById(postId);
        if (!post) throw new Error("Post not found");

        const user = await this.userRepo.getUserById(userId);
        if (!user) throw new Error('User not found');

        const comment = await this.commentRepo.findById(parentId);
        if (!comment) throw new Error("Comment not found");

        const newComment = await this.commentRepo.replyComment(postId, userId, content, parentId);
        if (!newComment) throw new Error("Failed to Post Reply Comment");

        const populatedComment: newCommentToSent = {
            _id: newComment._id!,
            text: newComment.content,
            createdAt: newComment.createdAt,
            postId: newComment.postId,
            userId: newComment.userId,
            parentId: newComment.parentId!,
            user: {
                _id: user._id!,
                username: user.name,
                profilePic: null
            }
        }
        return populatedComment;

    }
}