import { Destination } from "../../../domain/entities/Destination";
import { IDestinationRepository } from "../../../infrastructure/database/repositories/interface/IDestinationRepository";
import { PaginatedDestinations } from "../../../infrastructure/database/repositories/interface/PaginatedDestination";
import { IGetAllPaginatedDestinationUseCase } from "./Interface/IGetPaginatedDestinationUseCase";



export class GetAllPaginatedDestinationUseCase implements IGetAllPaginatedDestinationUseCase {
    constructor(
        private readonly destinationRepo: IDestinationRepository
    ) {};
    async execute(page: number, limit: number, search: string, attraction: string): Promise<PaginatedDestinations> {
        return await this.destinationRepo.findAllPgainated(page, limit, search, attraction);
    }

    async getNew(limit: number): Promise<Destination[]> {
        return await this.destinationRepo.findNewDest(limit);
    }
}