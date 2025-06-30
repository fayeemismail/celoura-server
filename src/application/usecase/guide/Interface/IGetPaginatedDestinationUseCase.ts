import { Destination } from "../../../../domain/entities/Destination";
import { PaginatedDestinations } from "../../../../infrastructure/database/repositories/interface/PaginatedDestination";



export interface IGetAllPaginatedDestinationUseCase {
    execute(page: number, limit: number, search: string, attraction: string): Promise<PaginatedDestinations>;
    getNew(limit: number): Promise<Destination[]>;
}