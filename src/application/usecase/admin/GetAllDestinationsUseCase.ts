import { Destination } from "../../../domain/entities/Destination";
import { DestinationRepository } from "../../../infrastructure/database/repositories/DestinationRepository";



export class GetAllDestinationsUseCase {
    private _destinaionRepo = new DestinationRepository()
    constructor() {}
    async findAll(): Promise<Destination[]>  {
        return await this._destinaionRepo.findAll()
    }
}   