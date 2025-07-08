import { Likes } from "../../../domain/entities/LikeEntitiy";
import LikesModel from "../models/LikesModel";
import { ILikeRepository } from "./interface/ILikeRepository";




export class LikeRepository implements ILikeRepository{
    async countByPostId(postId: string): Promise<number | null> {
        const allLikes = await LikesModel.countDocuments({postId: postId});
        return allLikes;
    };

    async findByPostId(postId: string): Promise<Likes[] | null> {
        const likes = await LikesModel.find({ postId })
        .populate('userId', "name profilePic")
        .lean();
        return likes
    }
}