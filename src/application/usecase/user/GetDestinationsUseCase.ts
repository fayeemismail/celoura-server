import { Destination } from "../../../domain/entities/Destination";
import destinationModel from "../../../infrastructure/database/models/DestinationModel";
import { IGetDestinationsUseCase } from "./interface/IGetDestinationsUseCase";



export class GetDestinationsUseCase implements IGetDestinationsUseCase {
    constructor() {}
    async findAll(): Promise<Destination[] | null> {
        return await destinationModel.find();
    }

    async findById(id: string): Promise<Destination | null> {
        return await destinationModel.findById(id);
    }
}