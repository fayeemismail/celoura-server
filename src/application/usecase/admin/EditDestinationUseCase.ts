import { env } from "../../../config/authConfig";
import { s3Client } from "../../../config/s3Config";
import { IDestinationRepository } from "../../../infrastructure/database/repositories/interface/IDestinationRepository";
import { EditDestinationInput } from "../../dto/admin/EditDestinationInput";
import { editSuccessOuput, IEditDestinationUseCase } from "./interface/IEditDestinationUseCase";
import { v4 as uuidv4 } from "uuid";

import {
  DeleteObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

export class EditDestinationUseCase implements IEditDestinationUseCase {
  constructor(private readonly _destRepo: IDestinationRepository) {}

  async execute(destinationId: string, editedData: EditDestinationInput): Promise<editSuccessOuput> {
    if (!destinationId) throw new Error("Destination Id Is Invalid");

    const destination = await this._destRepo.findById(destinationId);
    if (!destination) throw new Error("Destination Not found");

    let { name, description, location, country, features, deletedPhotos, files } = editedData;

    name = name?.trim();
    location = location?.trim();
    country = country?.trim();
    description = description?.trim();

    if (name && name !== destination.name) {
      const existingName = await this._destRepo.findByName(name);
      if (existingName && existingName?._id?.toString() !== destinationId) {
        throw new Error("The destination name already exists");
      }
    }

    const parsedFeatures = typeof features === "string" ? JSON.parse(features) as string[] : [];
    const parsedDeletedPhotos = deletedPhotos ? JSON.parse(deletedPhotos) as string[] : [];

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
      await s3Client.send(new DeleteObjectsCommand(deleteParams));
    }

    const remainingPhotos = destination.photos.filter(
      (photoUrl) => !parsedDeletedPhotos.includes(photoUrl)
    );

    const uploadPhotoUrls: string[] = [];
    if (files && files.length > 0) {
      for (const photo of files) {
        const photoExt = photo.originalname.split(".").pop();
        const key = `destinations/${uuidv4()}.${photoExt}`;

        await s3Client.send(
          new PutObjectCommand({
            Bucket: env.S3_BUCKET!,
            Key: key,
            Body: photo.buffer,
            ContentType: photo.mimetype,
          })
        );

        const uploadUrl = `https://${env.S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
        uploadPhotoUrls.push(uploadUrl);
      }
    }

    const updatedPhotos = [...remainingPhotos, ...uploadPhotoUrls];

    const updatedDestination = await this._destRepo.update(destinationId, {
      name: name ?? destination.name,
      description: description ?? destination.description,
      location: location ?? destination.location,
      country: country ?? destination.country,
      features: parsedFeatures.length > 0 ? parsedFeatures : destination.features,
      photos: updatedPhotos,
      lovedBy: destination.lovedBy,
      guides: destination.guides,
      createdAt: destination.createdAt,
      updatedAt: new Date(),
    });

    return {
      message: "Destination updated successfully",
      data: updatedDestination,
    };
  }

  private extractS3KeyFromUrl(url: string): string {
    const bucketUrlPrefix = `https://${env.S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/`;
    return url.replace(bucketUrlPrefix, "");
  }
}
