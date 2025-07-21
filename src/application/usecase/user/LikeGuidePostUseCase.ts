import { Likes } from "../../../domain/entities/LikeEntitiy";
import { ILikeRepository } from "../../../infrastructure/database/repositories/interface/ILikeRepository";
import { IPostRepository } from "../../../infrastructure/database/repositories/interface/IPostsRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { ILikeGuidePostUseCase } from "./interface/ILikeGuidePostUseCase";



export class LikeGuidePostUseCase implements ILikeGuidePostUseCase {
    constructor(
        private likeRepo: ILikeRepository,
        private userRepo: IUserRepository,
        private postRepo: IPostRepository
    ){};
    async execute(postId: string, userId: string): Promise<Likes> {
        if(!postId) throw new Error('PostId not found');
        if(!userId) throw new Error('UserId not found');

        const user = await this.userRepo.getUserById(userId);
        if(!user) throw new Error('User not found');

        const post = await this.postRepo.findById(postId);
        if(!post) throw new Error('Post not found');

        const newLike = await this.likeRepo.likePost(postId, userId);
        return newLike!;
    }
};