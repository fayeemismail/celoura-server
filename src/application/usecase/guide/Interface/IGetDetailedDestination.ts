import { Destination } from "../../../../domain/entities/Destination";



export interface IGetDetailedDestination {
    execute(destinationId: string): Promise<Destination | null>
}