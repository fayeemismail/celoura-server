import { Destination } from "../../../../domain/entities/Destination";
import { PaginatedDestinations } from "../../../../infrastructure/database/repositories/interface/PaginatedDestination";


export interface IGetAllDestinations {
    findAll(): Promise<Destination[]>;
    execute(page: number, limit: number, search: string, attraction: string): Promise<PaginatedDestinations>;
    findNew(limit: number): Promise<Destination[]>
};