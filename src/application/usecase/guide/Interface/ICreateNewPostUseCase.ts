import { Posts } from "../../../../domain/entities/PostEntity";


export interface CreatePostInput{
    photos?: Express.Multer.File[];
    caption?: string;
    userId: string;
    commentsEnabled?: boolean
}


export interface ICreateNewPostUseCase {
    execute(formdData: CreatePostInput): Promise<Posts>
}