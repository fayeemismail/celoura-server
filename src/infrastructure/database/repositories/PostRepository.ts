import { Posts } from "../../../domain/entities/PostEntity";        
import PostModel from "../models/PostModel";
import { IPostRepository } from "./interface/IPostsRepository";



export class PostRepository implements IPostRepository{
    async create(post: Posts): Promise<Posts> {
        const newPost = new PostModel(post);
        return newPost.save();
    };

    async findById(id: string): Promise<Posts | null> {
        return await PostModel.findById(id);
    }

    async findByGuideId(guideId: string): Promise<Posts[] | null> {
        return await PostModel.find({guideId: guideId});
    };

    async findByPostId(postId: string): Promise<Posts | null> {
        return await PostModel.findById(postId);
    }
}