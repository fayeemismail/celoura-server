import { Comments } from "../../../domain/entities/CommentEntity";


export class newCommentDTO {
  constructor(
    public readonly _id: string,
    public readonly userId: string,
    public readonly postId: string,
    public readonly content: string,
    public readonly createdAt: Date,
    public readonly parentId: string | null
  ) {}

  static fromDomain(comment: Comments): newCommentDTO {
    if (!comment || !comment._id || !comment.userId || !comment.postId || !comment.content || !comment.createdAt) {
      throw new Error('comment not found');
    }
    return new newCommentDTO(
      comment._id,
      comment.userId,
      comment.postId,
      comment.content,
      comment.createdAt,
      comment.parentId ?? null
    );
  }
}









export interface AddReplyComment {
    postId: string;
    content: string;
    userId: string;
    parentId: string;
}