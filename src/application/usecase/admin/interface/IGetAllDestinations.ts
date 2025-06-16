import { Destination } from "../../../../domain/entities/Destination";


export interface IGetAllDestinations {
    findAll(): Promise<Destination[]>;
}