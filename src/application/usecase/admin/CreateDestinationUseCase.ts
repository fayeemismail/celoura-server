import { Destination } from "../../../domain/entities/Destination";
import { IDestinationRepository } from "../../../infrastructure/database/repositories/interface/IDestinationRepository";
import { ICreateDestintaion } from "./interface/ICreateDestination";

export class CreateDestinationUseCase implements ICreateDestintaion {
  constructor(private readonly _destinationRepo: IDestinationRepository) {}

  async execute(
    name: string,
    location: string,
    country: string,
    description: string,
    photos: string[],
    features: string[]
  ): Promise<Destination> {
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

    // 4. Create destination in DB
    const newDestination = await this._destinationRepo.create({
      name,
      location,
      country,
      description,
      features,
      photos, // Now an array of S3 URLs
      lovedBy: [],
      guides: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return newDestination;
  }
}