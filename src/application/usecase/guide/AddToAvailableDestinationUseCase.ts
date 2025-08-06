import { IDestinationRepository } from "../../../infrastructure/database/repositories/interface/IDestinationRepository";
import { IGetGuideRepository } from "../../../infrastructure/database/repositories/interface/IGuideRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IAddToAvailableDestinationUseCase } from "./Interface/IAddToAvailableDestinationUseCase";



export class AddToAvailableDestinationUseCase implements IAddToAvailableDestinationUseCase {
    constructor(
        private destinationRepo : IDestinationRepository,
        private userRepo : IUserRepository,
        private guideRepo : IGetGuideRepository
    ) {}
    async execute(destinationId: string, guideId: string): Promise<void> {
        if(!destinationId) throw new Error("Destination Id not found");
        if(!guideId) throw new Error("guide Id not found");

        const destination = await this.destinationRepo.findById(destinationId);
        if(!destination) throw new Error("Destination Not found");

        const guideUser = await this.userRepo.getUserById(guideId);
        if(!guideUser) throw new Error("User not found");

        const guide = await this.userRepo.getGuideById(guideId);
        if(!guide) throw new Error("Guide not found");

        if(!guide.availableDestinations){
            guide.availableDestinations = [];
        };

        if(!guide.availableDestinations.includes(destination.name)){
            guide.availableDestinations.push(destination.name)
        }

        if(!guide.availableDestinations.includes(destination.location)) {
            guide.availableDestinations.push(destination.location);
        }
        
        await this.guideRepo.addAvailableDestination(guide._id!, { availableDestinations: guide.availableDestinations })
    }
}