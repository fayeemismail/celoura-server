import { ICommentRepository } from "../../../infrastructure/database/repositories/interface/ICommentsRepository";
import { ILikeRepository } from "../../../infrastructure/database/repositories/interface/ILikeRepository";
import { IPostRepository } from "../../../infrastructure/database/repositories/interface/IPostsRepository";
import { ISinglePostDetails, CommentWithReplies } from "../../interfaces/IPostSummary";
import { IGetSinglePostUseCase } from "./Interface/IGetSinglePostUseCase";
import { Comments } from "../../../domain/entities/CommentEntity";
import { Likes } from "../../../domain/entities/LikeEntitiy";

// Extended types for populated fields
type PopulatedComment = Comments & {
  parentId?: string | null;
  user: {
    _id: string;
    name: string;
    profilePic: string | null;
  };
};

type PopulatedLike = Likes & {
  userId: {
    _id: string;
    name: string;
    profilePic?: string;
  };
};

export class GetSinglePostUseCase implements IGetSinglePostUseCase {
  constructor(
    private postRepo: IPostRepository,
    private commentsRepo: ICommentRepository,
    private likeRepo: ILikeRepository
  ) {}

  async execute(_id: string): Promise<ISinglePostDetails> {
    const post = await this.postRepo.findByPostId(_id);
    if (!post) throw new Error("Post not found");

    const commentsData = await this.commentsRepo.findByPostId(_id);
    const likesData = await this.likeRepo.findByPostId(_id);

    // Step 1: Transform comments to nested structure
    const allComments: CommentWithReplies[] = (commentsData ?? []).map((comment) => {
      const populatedComment = comment as PopulatedComment;
      return {
        _id: populatedComment._id!,
        text: populatedComment.content,
        createdAt: populatedComment.createdAt,
        parentId: populatedComment.parentId ?? null,
        user: {
          _id: populatedComment.user._id,
          username: populatedComment.user.name,
          profilePic: populatedComment.user.profilePic,
        },
        replies: [],
      };
    });

    const commentMap = new Map<string, CommentWithReplies>();
    const topLevelComments: CommentWithReplies[] = [];

    allComments.forEach((comment) => {
      commentMap.set(comment._id, comment);
    });

    allComments.forEach((comment) => {
      if (comment.parentId) {
        const parentComment = commentMap.get(comment.parentId.toString());
        if (parentComment) {
          parentComment.replies.push(comment);
        }
      } else {
        topLevelComments.push(comment);
      }
    });

    // Step 2: Map likes
    const likes = (likesData ?? []).map((like) => {
      const populatedLike = like as PopulatedLike;
      return {
        _id: populatedLike.userId._id,
        username: populatedLike.userId.name,
        profilePic: populatedLike.userId.profilePic ?? "",
      };
    });

    return {
      _id: post._id!,
      caption: post.caption,
      photo: post.photos,
      createdAt: post.createdAt!,
      comments: topLevelComments,
      likes,
    };
  }
}
