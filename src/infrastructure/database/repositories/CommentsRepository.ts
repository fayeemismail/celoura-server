import { Comments } from "../../../domain/entities/CommentEntity";
import CommentsModel from "../models/CommentsModel";
import guideModel from "../models/guideModel";
import userModel from "../models/userModel";
import { ICommentRepository } from "./interface/ICommentsRepository";

export interface PopulatedCommentResult {
  _id: string;
  postId: string;
  content: string;
  createdAt: Date;
  parentId?: string | null;
  user: {
    _id: string;
    name: string;
    profilePic: string | null;
  };
}

export class CommentsRepository implements ICommentRepository {
  async countByPostId(postId: string): Promise<number | null> {
    return await CommentsModel.countDocuments({ postId });
  }

  async findByPostId(postId: string): Promise<PopulatedCommentResult[]> {
    const comments = await CommentsModel.find({ postId })
      .populate("userId", "name role")
      .lean();

    const result: PopulatedCommentResult[] = await Promise.all(
      comments.map(async (comment) => {
        const user = await userModel.findById(comment.userId);
        if (!user) throw new Error("User not found");

        let profilePic: string | null = null;

        if (user.role === "guide") {
          const guide = await guideModel
            .findOne({ user: user._id })
            .select("profilePic")
            .lean();
          profilePic = guide?.profilePic ?? null;
        }

        return {
          _id: comment._id.toString(),
          postId: comment.postId.toString(),
          content: comment.content,
          createdAt: comment.createdAt,
          parentId: comment.parentId ?? null,
          user: {
            _id: user._id.toString(),
            name: user.name,
            profilePic,
          },
        };
      })
    );
    return result;
  }

  async findById(commentId: string): Promise<Comments | null> {
    return await CommentsModel.findById(commentId);
  }

  async newComment(postId: string, userId: string, content: string): Promise<Comments | null> {
    const newComment = new CommentsModel({ postId, content, userId });
    return newComment.save();
  }

  async replyComment(postId: string, userId: string, content: string, parentId: string): Promise<Comments> {
    const newComment = new CommentsModel({ postId, content, userId, parentId });
    return newComment.save();
  }
}
