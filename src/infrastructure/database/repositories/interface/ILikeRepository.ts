import { Likes } from "../../../../domain/entities/LikeEntitiy";




export interface ILikeRepository {
    countByPostId(postId: string): Promise<number | null>;
    findByPostId(postId: string): Promise<Likes[] | null>
} 