import { Destination } from "../../../domain/entities/Destination";
import destinationModel from "../models/DestinationModel";
import { IDestinationRepository } from "./interface/IDestinationRepository";



export class DestinationRepository implements IDestinationRepository {
    async create(destination: Destination): Promise<Destination> {
        const newDestination = new destinationModel(destination);
        return newDestination.save()
    }

    async findByName(name: string): Promise<Destination | null> {
        return destinationModel.findOne({name})
    }
}