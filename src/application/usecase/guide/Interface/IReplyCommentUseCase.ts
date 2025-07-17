import { AddReplyComment } from "../../../dto/guide/newCommentDto";



export interface IReplyCommentUseCase {
    execute(data: AddReplyComment): Promise<any>
}