import { Destination } from "../../../../domain/entities/Destination";
import { Guide } from "../../../../domain/entities/Guide";
import { PaginatedDestinations } from "./PaginatedDestination";


export interface IDestinationRepository {
    create(destination: Destination): Promise<Destination>
    findByName(name: string): Promise<Destination | null>;
    findAll(): Promise<Destination[]>;
    findAllPgainated(page: number, limit: number, search: string, attraction: string): Promise<PaginatedDestinations>;
    findNewDest(limit: number): Promise<Destination[]>;
    findById(_id: string): Promise<Destination | null>;
    update(id: string, updatedData: Destination): Promise<Destination>;
    deleteById(id: string): Promise<void>;
}