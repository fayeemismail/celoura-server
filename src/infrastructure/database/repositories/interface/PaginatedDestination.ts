import { Destination } from "../../../../domain/entities/Destination";


export interface PaginatedDestinations {
    data: Destination[];
    total: number;
};