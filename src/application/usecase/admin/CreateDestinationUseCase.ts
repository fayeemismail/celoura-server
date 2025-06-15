import { env } from "../../../config/authConfig";
import { s3 } from "../../../config/s3Config";
import { DestinationRepository } from "../../../infrastructure/database/repositories/DestinationRepository";
import { ICreateDestintaion } from "./interface/ICreateDestination";
import { v4 as uuidv4 } from 'uuid';



export class CreateDestinationUseCase implements ICreateDestintaion {
    private _destinationRepo = new DestinationRepository();

    constructor() {}

    async execute(
    name: string,
    location: string,
    country: string,
    description: string,
    photos: Express.Multer.File[],
    features: string[]
): Promise<any> {
    // 1. Trim inputs
    name = name.trim();
    location = location.trim();
    country = country.trim();
    description = description.trim();

    // 2. Basic validation
    if (!name) {
        throw new Error("Name is required and cannot be empty.");
    }
    if (!location) {
        throw new Error("Location is required and cannot be empty.");
    }
    if (!country) {
        throw new Error("Country is required and cannot be empty.");
    }
    if (!description) {
        throw new Error("Description is required and cannot be empty.");
    }
    if (!photos || photos.length === 0) {
        throw new Error("At least one photo is required.");
    }
    if (!features || features.length === 0) {
        throw new Error("At least one feature is required.");
    }

    // 3. Check for duplicates
    const exists = await this._destinationRepo.findByName(name);
    if (exists) {
        throw new Error("This destination already exists.");
    }

    // 4. Upload images to S3
    const uploadPhotoUrls: string[] = [];

    for (const photo of photos) {
        const photoExt = photo.originalname.split('.').pop();
        const key = `destinations/${uuidv4()}.${photoExt}`;

        const uploadResult = await s3.upload({
            Bucket: env.S3_BUCKET!,
            Key: key,
            Body: photo.buffer,
            ContentType: photo.mimetype,
        }).promise();

        uploadPhotoUrls.push(uploadResult.Location);
    }

    // 5. Create destination in DB
    const newDestination = await this._destinationRepo.create({
        name,
        location,
        country,
        description,
        features,
        photos: uploadPhotoUrls,
        lovedBy: [],
        guides: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    return newDestination;
}

}