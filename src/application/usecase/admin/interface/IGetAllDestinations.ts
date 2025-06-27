import { Destination } from "../../../../domain/entities/Destination";


export interface IGetAllDestinations {
    findAll(): Promise<Destination[]>;
    execute(page: number, limit: number, search: string, attraction: string): Promise<any>;
    findNew(limit: number): Promise<Destination[]>
}