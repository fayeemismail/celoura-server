import { Destination } from "../../../../domain/entities/Destination";



export interface IGetDestinationsUseCase {
    findById(id: string): Promise<Destination | null>;
    findAll(): Promise<Destination[] | null>;
}