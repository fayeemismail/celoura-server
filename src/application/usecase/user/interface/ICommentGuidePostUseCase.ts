import { newCommentToSent } from "../../../dto/user/ICommentResponse";
import { CommentPostContent } from "../../guide/Interface/ICommentPostUseCase";




export interface ICommentGuidePostUseCase {
    execute(data: CommentPostContent): Promise<newCommentToSent>;
};