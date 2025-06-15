import { Destination } from "../../../../domain/entities/Destination";


export interface IDestinationRepository {
    create(destination: Destination): Promise<Destination>
    findByName(name: string): Promise<Destination | null>
}