import { Destination } from "../../../domain/entities/Destination";
import { DestinationRepository } from "../../../infrastructure/database/repositories/DestinationRepository";



export class GetAllDestinationsUseCase {
    private _destinaionRepo = new DestinationRepository()
    constructor() {}
    async findAll(): Promise<Destination[]>  {
        return await this._destinaionRepo.findAll()
    }
    
    async execute(page: number, limit: number, search: string, attraction: string) {
        return await this._destinaionRepo.findAllPgainated(page, limit, search, attraction);
    }

    async findNew(limit: number) {
        return await this._destinaionRepo.findNewDest(limit)
    }
}   