import { Destination } from "../../../domain/entities/Destination";
import { IDestinationRepository } from "../../../infrastructure/database/repositories/interface/IDestinationRepository";
import { IGetAllDestinations } from "./interface/IGetAllDestinations";



export class GetAllDestinationsUseCase implements IGetAllDestinations {
    constructor( private readonly _destinationRepo: IDestinationRepository ) {}
    async findAll(): Promise<Destination[]>  {
        return await this._destinationRepo.findAll();
    }
    
    async execute(page: number, limit: number, search: string, attraction: string) {
        return await this._destinationRepo.findAllPgainated(page, limit, search, attraction);
    }

    async findNew(limit: number) {
        return await this._destinationRepo.findNewDest(limit)
    }
}   