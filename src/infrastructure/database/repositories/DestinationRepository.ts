import { Destination } from "../../../domain/entities/Destination";
import destinationModel from "../models/DestinationModel";
import { IDestinationRepository } from "./interface/IDestinationRepository";



export class DestinationRepository implements IDestinationRepository {
    async create(destination: Destination): Promise<Destination> {
        const newDestination = new destinationModel(destination);
        return newDestination.save()
    }

    async findByName(name: string): Promise<Destination | null> {
        return destinationModel.findOne({ name })
    }

    async findAll(): Promise<Destination[]> {
        return destinationModel.find();
    }

    async findAllPgainated(page: number, limit: number, search: string, attraction: string) {
        const skip = (page - 1) * limit;
        const query: any = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ]
        };

        if (attraction) {
            query.features = { $elemMatch: { $regex: attraction, $options: "i" } };
        }


        const [data, total] = await Promise.all([
            destinationModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
            destinationModel.countDocuments(query)
        ]);

        return { data, total };
    }

    async findNewDest(limit: number) {
        const data = await destinationModel.find().limit(limit).sort({ createdAt: -1 });
        return data;
    }

    async findById(_id: string): Promise<Destination | null> {
        return destinationModel.findById(_id);

    }
}