import { Likes } from "../../../../domain/entities/LikeEntitiy";


export interface ILikeGuidePostUseCase{
    execute(postId: string, userId: string): Promise<Likes>;
};