import { Comments } from "../../../../domain/entities/CommentEntity";
import { PopulatedCommentResult } from "../CommentsRepository";




export interface ICommentRepository{
    countByPostId(postId: string): Promise<number | null>;
    findByPostId(postId: string): Promise<PopulatedCommentResult[] | null>;
    findById(commentId: string): Promise<Comments | null>;
    newComment(postId: string, userId: string, content: string): Promise<Comments | null>
    replyComment(postId: string, userId: string, content: string, parentId: string): Promise<Comments>;
}