import { newCommentToSent } from "../CommentPostUseCase";


export interface CommentPostContent{
    postId: string;
    content: string;
    userId: string;
}


export interface ICommentPostUseCase {
    execute(data: CommentPostContent): Promise<newCommentToSent>;
}