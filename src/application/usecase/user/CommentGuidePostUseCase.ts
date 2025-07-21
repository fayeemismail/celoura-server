import { ICommentRepository } from "../../../infrastructure/database/repositories/interface/ICommentsRepository";
import { IPostRepository } from "../../../infrastructure/database/repositories/interface/IPostsRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { newCommentToSent } from "../../dto/user/ICommentResponse";
import { CommentPostContent } from "../guide/Interface/ICommentPostUseCase";
import { ICommentGuidePostUseCase } from "./interface/ICommentGuidePostUseCase";



export class CommentGuidePostUseCase implements ICommentGuidePostUseCase {
    constructor(
        private postRepo: IPostRepository,
        private commentRepo: ICommentRepository,
        private userRepo: IUserRepository
    ) { };
    async execute(data: CommentPostContent): Promise<newCommentToSent> {
        const { postId, content, userId } = data;

        if (!postId) throw new Error('postId not found');
        if (!content) throw new Error("Content missing");
        if (!userId) throw new Error('UserId not found');

        const post = await this.postRepo.findById(postId);
        if (!post) throw new Error('Post not found');

        const user = await this.userRepo.getUserById(userId);
        if (!user) throw new Error('User not found');

        const newComment = await this.commentRepo.newComment(postId, userId, content);
        if (!newComment) throw new Error('Failed to create comment');

        const populatedComment: newCommentToSent = {
                _id: newComment._id!,
                text: newComment.content,
                createdAt: newComment.createdAt,
                postId: newComment.postId,
                userId: newComment.userId,
                parentId: null,
                user: {
                    _id: user._id!,
                    username: user.name,
                    profilePic: null
                }
            };
        
        return populatedComment;
    }
}