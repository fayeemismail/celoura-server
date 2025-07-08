import { Posts } from "../../../../domain/entities/PostEntity";



export interface IPostRepository{
    create(post: Posts): Promise<Posts>;
    findById(id: string): Promise<Posts | null>;
    findByGuideId(guideId: string): Promise<Posts[] | null>;
    findByPostId(postId: string): Promise<Posts | null>
}