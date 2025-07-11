import { Likes } from "../../../domain/entities/LikeEntitiy";
import guideModel from "../models/guideModel";
import LikesModel from "../models/LikesModel";
import userModel from "../models/userModel";
import { ILikeRepository } from "./interface/ILikeRepository";




export class LikeRepository implements ILikeRepository{
    async countByPostId(postId: string): Promise<number | null> {
        const allLikes = await LikesModel.countDocuments({postId: postId});
        return allLikes;
    };

    async findByPostId(postId: string): Promise<Likes[] | null> {
        const Likes = await LikesModel.find({ postId })
        .populate('userId', 'name role')
        .lean();

        const result = await Promise.all(
            Likes.map((async (like) => {
                const userId = like.userId;
                const user = await userModel.findById(userId);
                if(!user) throw new Error("User not found");

                if(user.role === 'guide') {
                    const guide = await guideModel.findOne({ user: user._id }).select('profilePic').lean();
                    return {
                        ...like,
                        user:{
                            _id: user._id,
                            name: user.name,
                            profilePic: guide?.profilePic || null
                        }
                    };
                } else {
                    return {
                        ...like,
                        user:{
                            _id: user._id,
                            name: user.name,
                            profilePic: null
                        }
                    }
                }
            }))
        );
        return result
    };

    async likePost(postId: string, userId: string): Promise<Likes | null> {
        const newLike = new LikesModel({postId, userId});
        return newLike.save();
    };

    async unlikePost(postId: string, userId: string): Promise<Likes | null> {
        return await LikesModel.findOneAndDelete({ postId, userId });
    }


}