import { env } from "../../../config/authConfig";
import { s3 } from "../../../config/s3Config";
import { IDestinationRepository } from "../../../infrastructure/database/repositories/interface/IDestinationRepository";
import { EditDestinationInput } from "../../dto/admin/EditDestinationInput";
import { editSuccessOuput, IEditDestinationUseCase } from "./interface/IEditDestinationUseCase";
import { v4 as uuidv4 } from "uuid";

export class EditDestinationUseCase implements IEditDestinationUseCase {
  constructor(private readonly destRepo: IDestinationRepository) {}

  async execute(destinationId: string, editedData: EditDestinationInput): Promise<editSuccessOuput> {
    if (!destinationId) throw new Error("Destination Id Is Invalid");

    const destination = await this.destRepo.findById(destinationId);
    if (!destination) throw new Error("Destination Not found");

    let { name, description, location, country, features, deletedPhotos, files } = editedData;

    name = name?.trim();
    location = location?.trim();
    country = country?.trim();
    description = description?.trim();

    if (!name || !description || !location || !country || !features) {
      throw new Error("All fields are required");
    }

    // Parse JSON strings
    const parsedFeatures = typeof features == 'string' ? JSON.parse(features) as string[] : [];
    const parsedDeletedPhotos = deletedPhotos ? JSON.parse(deletedPhotos) as string[] : [];

    // Delete specified photos from S3
    if (parsedDeletedPhotos.length > 0) {
      const deleteParams = {
        Bucket: env.S3_BUCKET!,
        Delete: {
          Objects: parsedDeletedPhotos.map((url) => ({
            Key: this.extractS3KeyFromUrl(url),
          })),
          Quiet: true,
        },
      };

      await s3.deleteObjects(deleteParams).promise();
    }

    // Remove deleted photos from existing destination photos array
    const remainingPhotos = destination.photos.filter(
      (photoUrl) => !parsedDeletedPhotos.includes(photoUrl)
    );

    // Upload new photos
    const uploadPhotoUrls: string[] = [];
    if (files && files.length > 0) {
      for (const photo of files) {
        const photoExt = photo.originalname.split(".").pop();
        const key = `destinations/${uuidv4()}.${photoExt}`;

        const uploadResult = await s3
          .upload({
            Bucket: env.S3_BUCKET!,
            Key: key,
            Body: photo.buffer,
            ContentType: photo.mimetype,
          })
          .promise();

        uploadPhotoUrls.push(uploadResult.Location);
      }
    }

    // Combine photos: remaining existing + newly uploaded
    const updatedPhotos = [...remainingPhotos, ...uploadPhotoUrls];

    // Update the destination in the DB
    const updatedDestination = await this.destRepo.update(destinationId, {
        name,
        description,
        location,
        country,
        features: parsedFeatures,
        photos: updatedPhotos,
        lovedBy: destination.lovedBy,
        guides: destination.guides,
        createdAt: destination.createdAt,
        updatedAt: new Date()
    });

    return {
      message: "Destination updated successfully",
      data: updatedDestination,
    };
  }

  /**
   * Extracts the S3 key from a full S3 URL.
   */
  private extractS3KeyFromUrl(url: string): string {
    const bucketUrlPrefix = `https://${env.S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/`;
    return url.replace(bucketUrlPrefix, "");
  }
}
