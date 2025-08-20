import { Destination } from "../../../domain/entities/Destination";
import { IDestinationRepository } from "../../../infrastructure/database/repositories/interface/IDestinationRepository";
import { IGetDestinationUseCase } from "./interface/IGetDestinationUseCase";



export class GetDestinationUseCase implements IGetDestinationUseCase {
    constructor(
        private _destinationRepo: IDestinationRepository
    ){}
    async execute(destinationId: string): Promise<Destination> {
        if(!destinationId) throw new Error('Invalid DestinationId');
        const destination = await this._destinationRepo.findById(destinationId);
        if(!destination) throw new Error("Destination not found");
        return destination
    }
}