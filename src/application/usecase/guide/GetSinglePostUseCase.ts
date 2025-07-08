import { Posts } from "../../../domain/entities/PostEntity";
import { ICommentRepository } from "../../../infrastructure/database/repositories/interface/ICommentsRepository";
import { ILikeRepository } from "../../../infrastructure/database/repositories/interface/ILikeRepository";
import { IPostRepository } from "../../../infrastructure/database/repositories/interface/IPostsRepository";
import { ISinglePostDetails } from "../../interfaces/IPostSummary";
import { IGetSinglePostUseCase } from "./Interface/IGetSinglePostUseCase";



export class GetSinglePostUseCase implements IGetSinglePostUseCase {
    constructor(
        private postRepo: IPostRepository,
        private commentsRepo: ICommentRepository,
        private likeRepo: ILikeRepository
    ) { }
    async execute(_id: string): Promise<ISinglePostDetails> {
        const post = await this.postRepo.findByPostId(_id);
        if (!post) throw new Error("Post not found");

        const likesData = await this.likeRepo.findByPostId(_id);
        const commentsData = await this.commentsRepo.findByPostId(_id);

        const comments = (commentsData ?? []).map((comment: any) => ({
            _id: comment._id,
            text: comment.text,
            createdAt: comment.createdAt,
            user: {
                _id: comment.userId._id,
                username: comment.userId.name, // mapping 'name' to 'username'
                profilePic: comment.userId.profilePic,
            },
        }));

        const likes = (likesData ?? []).map((like: any) => ({
            _id: like.userId._id,
            username: like.userId.name,
            profilePic: like.userId.profilePic,
        }));

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