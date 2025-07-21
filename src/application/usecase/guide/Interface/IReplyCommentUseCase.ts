import { AddReplyComment } from "../../../dto/guide/newCommentDto";
import { newCommentToSent } from "../CommentPostUseCase";



export interface IReplyCommentUseCase {
    execute(data: AddReplyComment): Promise<newCommentToSent>
}