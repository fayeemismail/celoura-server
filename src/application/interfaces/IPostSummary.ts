import { Comments } from "../../domain/entities/CommentEntity";
import { Likes } from "../../domain/entities/LikeEntitiy";

export interface IPostSummary {
  _id: string;
  caption: string;
  photo: string[]; 
  createdAt: Date;
  likesCount: number;
  commentsCount: number;
}


export interface IUserMinimal {
  _id: string;
  username: string;
  profilePic: string;
}

export interface IComment {
  _id: string;
  text: string;
  createdAt: Date;
  user: IUserMinimal;
}

export interface CommentWithReplies {
  _id: string;
  text: string;
  createdAt: Date;
  parentId: string | null;
  user: {
    _id: string;
    username: string;
    profilePic: string | null;
  };
  replies: CommentWithReplies[];
}

export interface ISinglePostDetails {
  _id: string;
  caption: string;
  photo: string[];
  createdAt: Date;
  comments: CommentWithReplies[];
  likes: {
    _id: string;
    username: string;
    profilePic: string;
  }[];
}


export type PopulatedComment = Comments & {
  parentId?: string | null;
  user: {
    _id: string;
    name: string;
    profilePic: string | null;
  };
};

export type PopulatedLike = Likes & {
  userId: {
    _id: string;
    name: string;
    profilePic?: string;
  };
};

