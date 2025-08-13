import { PutObjectCommand } from "@aws-sdk/client-s3";
import { IGenerateSignedUrlUseCase } from "./interface/IGenarateSignedUrlUseCase";
import { v4 as uuidv4 } from 'uuid'
import { env } from "../../../config/authConfig";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../../../config/s3Config";


export class GenerateSignedUrlUseCase implements IGenerateSignedUrlUseCase {
    async execute(photoCount: number): Promise<{ url: string; key: string; }[]> {
        if( !photoCount || photoCount < 1 || photoCount > 5 ){
            throw new Error("Invalid photo count (1 - 5 allowed)");
        };

        const signedUrl: { url: string; key: string }[] = [];
        
        for(let i = 0; i < photoCount; i++){
            const key = `destinations/${uuidv4()}.jpg`;
            const command = new PutObjectCommand({
                Bucket: env.S3_BUCKET!,
                Key: key,
                ContentType: "image/jpeg",
            });
            const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
            signedUrl.push({ url, key });
        };

        return signedUrl
    }
}