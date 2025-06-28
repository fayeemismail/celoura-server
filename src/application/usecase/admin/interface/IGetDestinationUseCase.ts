import { Destination } from "../../../../domain/entities/Destination";



export interface IGetDestinationUseCase {
    execute(destinationId: string): Promise<Destination>
}