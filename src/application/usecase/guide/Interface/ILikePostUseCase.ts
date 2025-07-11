import { Likes } from "../../../../domain/entities/LikeEntitiy";




export interface ILikePostUseCase {
    execute(postId: string, userId: string): Promise<Likes>;
}