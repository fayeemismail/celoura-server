import { ICommentRepository } from "../../../infrastructure/database/repositories/interface/ICommentsRepository";
import { ILikeRepository } from "../../../infrastructure/database/repositories/interface/ILikeRepository";
import { IPostRepository } from "../../../infrastructure/database/repositories/interface/IPostsRepository";
import { ISinglePostDetails } from "../../interfaces/IPostSummary";
import { IGetSinglePostUseCase } from "./Interface/IGetSinglePostUseCase";
import { Comments } from "../../../domain/entities/CommentEntity";
import { Likes } from "../../../domain/entities/LikeEntitiy";

// Extended types to handle populated fields
export type PopulatedComment = Comments & {
  user: {
    _id: string;
    name: string;
    profilePic: string;
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

    const comments = (commentsData ?? []).map((comment) => {
      const populatedComment = comment as PopulatedComment;
      return {
        _id: populatedComment._id!,
        text: populatedComment.content,
        createdAt: populatedComment.createdAt,
        user: {
          _id: populatedComment.user._id,
          username: populatedComment.user.name,
          profilePic: populatedComment.user.profilePic,
        },
      };
    });

    const likes = (likesData ?? []).map((like) => {
      const populatedLike = like as PopulatedLike;
      return {
        _id: populatedLike.userId._id,
        username: populatedLike.userId.name,
        profilePic: populatedLike.userId.profilePic ?? "",
      };
    });

    const result: ISinglePostDetails = {
      _id: post._id!,
      caption: post.caption,
      photo: post.photos,
      createdAt: post.createdAt!,
      comments,
      likes,
    };

    return result;
  }
}
