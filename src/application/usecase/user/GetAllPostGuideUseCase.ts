import { ICommentRepository } from "../../../infrastructure/database/repositories/interface/ICommentsRepository";
import { ILikeRepository } from "../../../infrastructure/database/repositories/interface/ILikeRepository";
import { IPostRepository } from "../../../infrastructure/database/repositories/interface/IPostsRepository";
import { IPostSummary } from "../../interfaces/IPostSummary";
import { IGetAllPostGuideUseCase } from "./interface/IGetAllPostGuideUseCase";




export class GetAllPostGuideUseCase implements IGetAllPostGuideUseCase {
    constructor(
        private _postRepo: IPostRepository,
        private _commentRepo: ICommentRepository,
        private _likeRepo: ILikeRepository
    ) {};
    async execute(id: string): Promise<IPostSummary[] | []> {
        const posts = await this._postRepo.findByGuideId(id);

        if(!posts || posts.length == 0){
            return []
        };

        const result: IPostSummary[] = await Promise.all(
            posts.map(async (post) => {
                const commentsCount = await this._commentRepo.countByPostId(post._id!) ?? 0;
                const likesCount = await this._likeRepo.countByPostId(post._id!)?? 0;

                return {
                    _id: post._id!,
                    caption: post.caption,
                    photo: post.photos,
                    createdAt: post.createdAt,
                    likesCount,
                    commentsCount
                };
            })
        );
        
        return result;
    }
}