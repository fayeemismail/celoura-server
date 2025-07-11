import { Comments } from "../../../../domain/entities/CommentEntity";




export interface ICommentRepository{
    countByPostId(postId: string): Promise<number | null>;
    findByPostId(postId: string): Promise<Comments[] | null>;
    newComment(postId: string, userId: string, content: string): Promise<Comments | null>
}