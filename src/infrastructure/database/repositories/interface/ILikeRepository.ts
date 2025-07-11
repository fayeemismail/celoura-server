import { Likes } from "../../../../domain/entities/LikeEntitiy";




export interface ILikeRepository {
    countByPostId(postId: string): Promise<number | null>;
    findByPostId(postId: string): Promise<Likes[] | null>;
    likePost(postId: string, userId: string): Promise<Likes | null>;
    unlikePost(postId: string, userId: string): Promise<Likes | null>;
} 