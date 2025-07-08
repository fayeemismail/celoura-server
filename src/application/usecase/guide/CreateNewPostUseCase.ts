import { env } from "../../../config/authConfig";
import { s3 } from "../../../config/s3Config";
import { Posts } from "../../../domain/entities/PostEntity";
import { IPostRepository } from "../../../infrastructure/database/repositories/interface/IPostsRepository";
import { CreatePostInput, ICreateNewPostUseCase } from "./Interface/ICreateNewPostUseCase";
import { v4 as uuidv4 } from "uuid";



export class CreatenewPostUseCase implements ICreateNewPostUseCase {
    constructor(
        private readonly postRepo: IPostRepository
    ){}
    async execute(formdData: CreatePostInput): Promise<Posts> {

        let { userId, caption, commentsEnabled, photos } = formdData;
        caption = caption?.trim();

        if(!caption) throw new Error("Caption is required")

        const uploadPhotoUrls: string[] = [];
        if(photos && photos.length > 0) {
            for(const photo of photos){
                const photoExt = photo.originalname.split('.').pop();
                const key = `posts/${uuidv4()}.${photoExt}`;
                const uploadResult = await s3.upload({
                    Bucket: env.S3_BUCKET!,
                    Key: key,
                    Body: photo.buffer,
                    ContentType: photo.mimetype
                }).promise();
                uploadPhotoUrls.push(uploadResult.Location)
            }
        };

        const newPost = await this.postRepo.create({
            photos: uploadPhotoUrls,
            caption,
            guideId: userId,
            comments: commentsEnabled!,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return newPost
    }
}