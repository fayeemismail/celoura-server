// application/usecase/admin/DeleteDestinationUseCase.ts

import { IDeleteDestinationUseCase } from "./interface/IDeleteDestinationUseCase";
import { IDestinationRepository } from "../../../infrastructure/database/repositories/interface/IDestinationRepository";
import { s3 } from "../../../config/s3Config";
import { env } from "../../../config/authConfig";

export class DeleteDestinationUseCase implements IDeleteDestinationUseCase {
  constructor(private readonly destinationRepo: IDestinationRepository) {}

  async execute(destinationId: string): Promise<{ message: string }> {
    if (!destinationId) throw new Error("Destination ID is required");

    const destination = await this.destinationRepo.findById(destinationId);
    if (!destination) throw new Error("Destination not found");

    // Delete all photos from S3
    if (destination.photos && destination.photos.length > 0) {
      const deleteParams = {
        Bucket: env.S3_BUCKET!,
        Delete: {
          Objects: destination.photos.map((url) => ({
            Key: this.extractS3KeyFromUrl(url),
          })),
          Quiet: true,
        },
      };

      await s3.deleteObjects(deleteParams).promise();
    }

    // Delete from DB
    await this.destinationRepo.deleteById(destinationId);

    return { message: "Destination deleted successfully" };
  }

  private extractS3KeyFromUrl(url: string): string {
    const bucketUrlPrefix = `https://${env.S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/`;
    return url.replace(bucketUrlPrefix, "");
  }
}
