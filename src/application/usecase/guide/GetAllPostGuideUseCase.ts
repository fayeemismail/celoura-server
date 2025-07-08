import { ICommentRepository } from "../../../infrastructure/database/repositories/interface/ICommentsRepository";
import { ILikeRepository } from "../../../infrastructure/database/repositories/interface/ILikeRepository";
import { IPostRepository } from "../../../infrastructure/database/repositories/interface/IPostsRepository";
import { IPostSummary } from "../../interfaces/IPostSummary";
import { IGetAllPostGuide } from "./Interface/IGetAllPostGuide";



export class GetAllPostsGuideUseCase implements IGetAllPostGuide {
    constructor(
        private postRepo: IPostRepository,
        private commentsRepo: ICommentRepository,
        private likeRepo: ILikeRepository
    ) { }
    async execute(id: string): Promise<IPostSummary[] | []> {
        const posts = await this.postRepo.findByGuideId(id);

        
        if (!posts || posts.length === 0) {
            return []; 
        }

        const result: IPostSummary[] = await Promise.all(
            posts.map(async (post) => {
                const commentsCount = await this.commentsRepo.countByPostId(post._id!) ?? 0;
                const likesCount = await this.likeRepo.countByPostId(post._id!) ?? 0;

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