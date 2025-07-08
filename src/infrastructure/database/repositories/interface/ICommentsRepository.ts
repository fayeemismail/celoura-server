import { Comments } from "../../../../domain/entities/CommentEntity";




export interface ICommentRepository{
    countByPostId(postId: string): Promise<number | null>;
    findByPostId(postId: string): Promise<Comments[] | null>;
}