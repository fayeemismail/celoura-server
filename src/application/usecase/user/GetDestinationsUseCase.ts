import { Destination } from "../../../domain/entities/Destination";
import { Guide } from "../../../domain/entities/Guide";
import destinationModel from "../../../infrastructure/database/models/DestinationModel";
import { IDestinationRepository } from "../../../infrastructure/database/repositories/interface/IDestinationRepository";
import { IGetGuideRepository } from "../../../infrastructure/database/repositories/interface/IGuideRepository";
import { GuideWithDestinationInfo, IGetDestinationsUseCase } from "./interface/IGetDestinationsUseCase";



export class GetDestinationsUseCase implements IGetDestinationsUseCase {
    constructor(
        private destinationRepo : IDestinationRepository,
        private guideRepo : IGetGuideRepository
    ) {}
    async findAll(): Promise<Destination[] | null> {
        return await destinationModel.find();
    }

    async findById(id: string): Promise<Destination | null> {
        return await this.destinationRepo.findById(id)
    };

    async getGuideWDestination(destinationId: string): Promise<{ destination: Destination; guide:Guide[]; }> {
        if(!destinationId) throw new Error("Cannot find The ID");

        const destination = await this.destinationRepo.findById(destinationId);
        if(!destination) throw new Error("Destination not found");

        const destinationName = destination.name;
        const destinationLocation = destination.location;

        let guides = await this.guideRepo.getGuideByDestinationName(destinationName, destinationLocation);

        guides = guides.filter((g) => g.user);

        return {
            destination,
            guide: guides
        };
    }
}