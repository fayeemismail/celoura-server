import { AddReplyCommentOnGuidePost, CommentPostContent, newCommentToSent } from "../../../dto/user/ICommentResponse";




export interface IReplyCommentGuidePostUseCase {
    execute(data: AddReplyCommentOnGuidePost): Promise<newCommentToSent>
}