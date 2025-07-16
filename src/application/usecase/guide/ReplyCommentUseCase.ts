import { ICommentRepository } from "../../../infrastructure/database/repositories/interface/ICommentsRepository";
import { IPostRepository } from "../../../infrastructure/database/repositories/interface/IPostsRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { AddReplyComment } from "../../dto/guide/newCommentDto";
import { newCommentToSent } from "./CommentPostUseCase";
import { IReplyCommentUseCase } from "./Interface/IReplyCommentUseCase";



export class ReplyCommentUseCase implements IReplyCommentUseCase{
    constructor(
        private postRepo: IPostRepository,
        private commentRepo: ICommentRepository,
        private userRepo: IUserRepository
    ) {}
    async execute(data: AddReplyComment): Promise<any> {
        const { postId, content, userId, parentId } = data;
        if(!postId || !content || !userId || !parentId){
            throw new Error('Fields are missing');
        };
        const post = await this.postRepo.findById(postId);
        if(!post) throw new Error("Post not found");

        const user = await this.userRepo.getUserById(userId);
        if(!user) throw new Error('User not found');

        const comment = await this.commentRepo.findById(parentId);
        if(!comment) throw new Error("Comment not found");
        
        const newComment = await this.commentRepo.replyComment(postId, userId, content, parentId);
        if(!newComment) throw new Error("Failed to Post Reply Comment");

        let profilePic: string | null = null
        if(user.role == 'guide'){
            const guide = await this.userRepo.getGuideById(userId);
            profilePic = guide?.profilePic || null;
        };

        const populatedComment: newCommentToSent = {
            _id: newComment._id!,
            text: newComment.content,
            createdAt: newComment.createdAt,
            postId: newComment.postId,
            userId: newComment.userId,
            parentId: newComment.parentId!,
            user:{
                _id: user._id!,
                username: user.name,
                profilePic: profilePic
            }
        }
        return populatedComment;
    }
}