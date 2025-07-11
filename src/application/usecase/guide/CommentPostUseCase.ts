import { ICommentRepository } from "../../../infrastructure/database/repositories/interface/ICommentsRepository";
import { IPostRepository } from "../../../infrastructure/database/repositories/interface/IPostsRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { CommentPostContent, ICommentPostUseCase } from "./Interface/ICommentPostUseCase";

export interface newCommentToSent {
    _id: string;
    text: string; 
    createdAt: Date;
    postId: string;
    userId: string;
    user: {
        _id: string;
        name: string;
        profilePic: string | null;
    };
}



export class CommentPostUseCase implements ICommentPostUseCase {
    constructor(
        private postRepo: IPostRepository,
        private commentRepo: ICommentRepository,
        private userRepo: IUserRepository
    ) {}

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

    let profilePic: string | null = null;
    if (user.role === 'guide') {
        const guide = await this.userRepo.getGuideById(userId);
        profilePic = guide?.profilePic || null;
    }

    const populatedComment: newCommentToSent = {
        _id: newComment._id!,
        text: newComment.content,
        createdAt: newComment.createdAt,
        postId: newComment.postId,
        userId: newComment.userId,
        user: {
            _id: user._id!,
            name: user.name,
            profilePic: profilePic!
        }
    };

    return populatedComment;
}

}
