import { Destination } from "../../../domain/entities/Destination";
import { IDestinationRepository } from "../../../infrastructure/database/repositories/interface/IDestinationRepository";
import { IGetDetailedDestination } from "./Interface/IGetDetailedDestination";



export class GetDetailedDestination implements IGetDetailedDestination {
    constructor(
        private _destRepo : IDestinationRepository
    ){}
    async execute(destinationId: string): Promise<Destination | null> {
        if(!destinationId) throw new Error("Id Not found");

        const destination = await this._destRepo.findById(destinationId);
        if(!destination) throw new Error("Destination not found");
        
        return destination
    }
}